import axios from "axios";
import e from "express";

import { IMdnsAnswer, IMdnsRegistryModel } from ".";
import { Node } from "../resources/node";
import { containsPTREntry, parseMdnsResponse } from "../utils";
import { IMdnsServiceConfig } from "./interfaces/i-mdns-service-config";

const multicastdns = require("multicast-dns");

export class MdnsService {

    private HEALTH_CHECK_PATH = "/x-nmos/registration/v1.3/health/nodes/";
    private HEARTBEAT_INTERVAL_IN_S: number = 5;

    private selectedRegistry: IMdnsRegistryModel;
    private onNewRegisteryFoundCallback;
    private nodeId: string;

    private registryList: IMdnsRegistryModel[] = [];
    private isHeartbeating: boolean = false;

    private interfaceIp;

    private apiVer: string = "v1.3";
    private apiProto: string = "http";
    private apiAuth: boolean = false;

    constructor(config: IMdnsServiceConfig) {
        this.onNewRegisteryFoundCallback = config.onNewRegistryFound || (() => { console.log("registryfoundcallback not implemented"); });
        this.interfaceIp = config.interfaceIp;
        this.startMdnsService();
    }

    public getHref() {
        return this.selectedRegistry.ipv4 + ":" + this.selectedRegistry.srv_port;
    }

    // Set a new nodeid to perform a nodeId against. If a registry exists, start a heartbeat
    public setNodeId(nodeId) {
        console.log(`Setting the new nodeid to ${nodeId}`);
        if (this.nodeId == nodeId) { return; }

        this.nodeId = nodeId;

        if (this.selectedRegistry) {
            this.startHeartbeat();
        }
    }

    // Start listening on mdns responses (also perform an initial mdns request)
    private startMdnsService() {
        console.log("MdnsService: startMdnsService");

        // Configure mdns library
        const mdns = multicastdns({
            multicast: true,
            interface: this.interfaceIp,
            reuseAddr: true
        });

        mdns.on('response', res => {

            // Only process response if answer containd ptr entry with correct name entry
            if (!containsPTREntry(res)) {
                console.log("No ptr entries in res.answers!");
                return;
            }

            // Try parse messages 
            let foundRegistry: IMdnsRegistryModel;
            try {
                foundRegistry = parseMdnsResponse(res);
                if (!foundRegistry) { return; }
            } catch (error) {
                console.error(error);
                return;
            }

            // Try add registry to registry list. Is succeeded: choose the best registry
            if( this.tryAddRegistry( foundRegistry ) ){
                this.selectRegistry();
            }

        });

        // Perorm a single mdns query at service startup
        this.performMdnsQuery(mdns);

    }

    // Add/ Update a registry to the registryList. then trigger setRegistry()
    private tryAddRegistry(registry: IMdnsRegistryModel): boolean {

        // does registry fit to the current node?
        if( !this.registryCompliesToRequirements( registry )){
            return false;
        }

        // Remove Registry from list if it already exists
        const existingIndex = this.registryList.findIndex(el => el.ptr == registry.ptr);
        if( existingIndex != -1 ){
            this.registryList = this.registryList.splice( existingIndex, 1 );
        }

        // Add registry to List;
        this.registryList.push(registry);
        return true;
    }


    // See https://specs.amwa.tv/is-04/releases/v1.3/docs/3.1._Discovery_-_Registered_Operation.html
    private registryCompliesToRequirements(registry: IMdnsRegistryModel) {
        return (
            registry.api_auth == this.apiAuth
            && registry.api_proto == this.apiProto
            && registry.api_ver.find(el => el == this.apiVer)
        )
    }


    // select the best registry according to the nmow amwa specifications;
    private selectRegistry() {
        console.log("Selecting registry out of a number of ", this.registryList.length);
        if (this.registryList.length < 1) {
            this.selectedRegistry = null;
            return;
        }

        let highestPrio = -1;
        let highestPrioRegistry: IMdnsRegistryModel;

        // Select the registry with the highest prio (or the first one)
        this.registryList.forEach((registry) => {
            if (registry.priority > highestPrio) {
                highestPrio = registry.priority;
                highestPrioRegistry = registry;
            }
        });

        this.selectedRegistry = highestPrioRegistry
        this.onNewRegistrySelected();
        this.onNewRegisteryFoundCallback(this.selectedRegistry);
    }


    // Callback if a new registry has been selected
    private onNewRegistrySelected() {
        console.log("MdnsService: OnNewRegistrySelected...");

        this.stopHeartbeat();

        if (this.nodeId) {
            this.stopHeartbeat();
            this.startHeartbeat();
        }
    }

    // Trigger a mdns query
    private performMdnsQuery(mdns) {
        console.log("MdnsService: performMdnsQuery");
        const registryServiceType = '_nmos-register._tcp.local';

        const query = {
            questions: [{
                name: registryServiceType,
                type: 'PTR'
            }]
        };

        mdns.query(query);
        console.log("MdnsService: performMdnsQuery - finished");
    }


    private startHeartbeat() {
        console.log(`MdnsService: startHeartbeat(${this.nodeId})`);
        if (this.isHeartbeating) {
            this.stopHeartbeat();
            setTimeout(() => {
                this.performHeartbeat();
                this.isHeartbeating = true;
            }, this.HEARTBEAT_INTERVAL_IN_S * 1000);
        }
        else {
            this.performHeartbeat();
            this.isHeartbeating = true;
        }
    }

    private performHeartbeat() {
        const url: URL = new URL("http://" + this.selectedRegistry.ipv4);
        url.pathname = this.HEALTH_CHECK_PATH + this.nodeId;

        let requestStart: Date = new Date();

        axios.post(url.toString())
            .then((response) => {
                console.log("Heartbeat response: ", response.status);
                setTimeout(() => {
                    if (this.isHeartbeating) {
                        this.performHeartbeat();
                    }
                    else {
                        this.isHeartbeating = false;
                    }
                }, this.HEARTBEAT_INTERVAL_IN_S * 1000);
            })
            .catch((error) => {
                console.log(`MdnsService: performingHearbeat(${this.nodeId}): Request Error!: ${error.response.statusCode}`);
                // on 404 : node is not known in the registry! > node must reregister each of its resources! (onNodeNotFound)

                this.onHeartbeatError();
            });

    }

    private stopHeartbeat() {
        console.log("Stopping heartbeat");
        this.isHeartbeating = false;
    }

    private onHeartbeatError() {
        this.stopHeartbeat();

        // Wait heartbeat interval to prevent heartbeat interval to gon on
        setTimeout(() => {
            // Remove current selectedRegistry from registryList
            this.registryList = this.registryList.filter(registry => registry.host != this.selectedRegistry.host);

            // select registry
            this.selectRegistry();

        }, this.HEARTBEAT_INTERVAL_IN_S * 1000);
    }

}