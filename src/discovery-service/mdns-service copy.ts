import axios from "axios";

import { IMdnsAnswer, IMdnsRegistryModel } from ".";
import { containsPTREntry, parseMdnsResponse } from "../utils";
import { IMdnsServiceConfig } from "./interfaces/i-mdns-service-config";

const multicastdns = require("multicast-dns");



export class MdnsService {

    private REGISTER_RESOURCE_PATH = "/x-nmos/registration/v1.3/resource";
    private HEALTH_CHECK_PATH = "/x-nmos/registration/v1.3/health/nodes/";
    private HEARTBEAT_INTERVAL_IN_S: number = 5;
    private selectedRegistry: IMdnsRegistryModel;

    private onNewRegisteryFoundCallback;
    private nodeId: string;

    private registryList: IMdnsRegistryModel[] = [];

    constructor(config: IMdnsServiceConfig) {
        // await service discovery
        this.onNewRegisteryFoundCallback = config.onNewRegistryFound || (() => { console.log("registryfoundcallback not implemented"); });
        this.startMdnsService();
    }

    public getHref() {
        return this.selectedRegistry.ipv4;
    }

    private startMdnsService() {
        console.log("MdnsService: startMdnsService");


        const mdns = multicastdns({
            multicast: true,
            interface: "192.168.178.41",
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
            if (!(this.registryList.find(el => el.host == foundRegistry.host))) {
                this.registryList.push(foundRegistry);
                console.log("Found registry", foundRegistry)
            }
            else {
                console.log("Registry already exists in foundRegistry List");
            }

            // iterate over regsitries and select suitable one
            this.selectRegistry();

        });

        this.performMdnsQuery(mdns);

    }

    // select the best registry according to the nmow amwa specifications;
    private selectRegistry() {
        let highestPrio = -1;
        let highestPrioRegistry: IMdnsRegistryModel;
        this.registryList.forEach( (registry ) => {
            if (registry.priority > highestPrio) {
                highestPrio = registry.priority;
                highestPrioRegistry = registry;
            }
        });

        if( !this.selectedRegistry ){ this.selectedRegistry = highestPrioRegistry }

        if( this.selectedRegistry.host != highestPrioRegistry.host ){
            this.setRegistry( highestPrioRegistry )
            this.onNewRegisteryFoundCallback( this.selectedRegistry );
        }
    }

    private setRegistry( registry ){
        // set current registry
        this.selectedRegistry = registry;

        // start heartbeat
        if( this.nodeId ){
            this.stopHeartbeat();
            this.startHeartbeat( this.nodeId );
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

    public startHeartbeat(nodeId: string) {
        console.log(`MdnsService: startHeartbeat(${nodeId})`);

        this.nodeId = nodeId;
        this.performHeartbeat();
    }

    private performHeartbeat() {
        const url: URL = new URL("http://" + this.selectedRegistry.ipv4);
        url.pathname = this.HEALTH_CHECK_PATH + this.nodeId;

        let requestStart: Date = new Date();
        console.log(`MdnsService: performingHeartbeat(${this.nodeId})`);


        axios.post(url.toString())
            .then((response) => {
                console.log(response.status);
                setTimeout(() => {
                    this.performHeartbeat();
                }, this.HEARTBEAT_INTERVAL_IN_S * 1000);
            })
            .catch((error) => {
                console.log(`MdnsService: performingHearbeat(${this.nodeId}): Request Error!`);
                this.onHeartbeatTimeout();
            });

    }

    private stopHeartbeat() {
        console.log("Stoping Heartbeat");
        
    }

    private onHeartbeatTimeout(){
        // Remove current selectedRegistry from registryList
        this.registryList.filter( registry => registry.host != this.selectedRegistry.host );

        // select registry
        this.selectRegistry();
    }
}