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

    constructor(config: IMdnsServiceConfig) {
        this.onNewRegisteryFoundCallback = config.onNewRegistryFound || (() => { console.log("registryfoundcallback not implemented"); });
        this.interfaceIp = config.interfaceIp;
        this.startMdnsService();
    }

    public getHref() {
        return this.selectedRegistry.ipv4+ ":" + this.selectedRegistry.srv_port;
    }

    // Set a new nodeid to perform a nodeId against. If a registry exists, start a heartbeat
    public setNodeId(nodeId) {
        console.log(`Setting the new nodeid to ${nodeId}`);
        if( this.nodeId == nodeId ){ return; }

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

            // Add to registry List if not a duplicat
            if (!(this.registryList.find(el => el.ptr== foundRegistry.ptr))) {
                //if( foundRegistry.api_ver.find( el => el === "v1.3" )){
                    if( foundRegistry.api_proto == "http" || foundRegistry.api_proto == "https"){
                        this.registryList.push(foundRegistry);
                        console.log("Found registry", foundRegistry)
                    }
                    else{
                        return;
                    }
                //}
                //else{
                    return;
                //}
            }
            else {
                console.log("Registry already exists in foundRegistry List");
                console.log( foundRegistry );
            }

            // iterate over regsitries and select suitable one
            this.selectRegistry();

        });

        // Perorm a single mdns query at service startup
        this.performMdnsQuery(mdns);

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

        /*
        // Only set new selected registry if the host values are different
        if (this.selectedRegistry.host != highestPrioRegistry.host) {

            this.selectedRegistry = highestPrioRegistry;
            this.onNewRegistrySelected();
            this.onNewRegisteryFoundCallback(this.selectedRegistry);
        }
        */
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
        if( this.isHeartbeating ){
            this.stopHeartbeat();
            setTimeout( ()=>{
                this.performHeartbeat();
                this.isHeartbeating = true;
            }, this.HEARTBEAT_INTERVAL_IN_S * 1000 );
        }
        else{
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