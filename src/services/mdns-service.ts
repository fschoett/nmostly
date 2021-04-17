import { IMdnsRegistryModel } from "./i-mdns-registry-model";
import { IMdnsAnswer } from "./i-mdns-response-answer";

import { Node } from "../models/node";

import axios from "axios";

const multicastdns = require('multicast-dns');

export class MdnsService {

    private REGISTER_RESOURCE_PATH = "/x-nmos/registration/v1.3/resource/";
    private HEALTH_CHECK_PATH =  "/x-nmos/registration/v1.3/health/nodes/";
    private HEARTBEAT_INTERVAL_IN_S: number = 5;
    private selectedRegistry: IMdnsRegistryModel;
    private nmosNode: Node;

    constructor() {

        // start mdns service
        // query for nmos services and register callback
        this.startServiceDiscovery();
    }

    public registerAllResources(node: Node) {
        // save node as local instance!
        this.nmosNode = node;

        this.postNodeToRegistry();
    }


    private startServiceDiscovery() {
        const mdns = multicastdns({});

        const registryServiceType = '_nmos-register._tcp.local';

        mdns.on('response', res => {
            const registryEntries: IMdnsAnswer[] = res.answers
                .filter(el => el.name === registryServiceType);

            

            if (registryEntries.length > 0) {
                console.log("Found registry at: ", registryEntries[0].data);

                const additionals: IMdnsAnswer[] = res.additionals;
                console.log( registryEntries, additionals  );
                const txtEntry = additionals.find(el => el.type === 'TXT');
                const aEntry = additionals.find(el => el.type === 'A');
                const srvEntry = additionals.find(el => el.type === 'SRV');
                const nSec = additionals.filter(el => el.type === 'NSEC');

                console.log(txtEntry);
                console.log(aEntry);
                console.log(srvEntry);

                if (!(txtEntry && aEntry && srvEntry)) {
                    console.log( "Additionals are empty.. perform new mdns query");
                    this.performMdnsQuery( mdns );
                    return;
                };

                let srvData = {
                    priority: 0,
                    target: undefined,
                    port: 80,
                    weight: 0
                };
                if (srvEntry) {
                    srvData = srvEntry.data;
                }

                const apiInfo = {};
                const registryModel: IMdnsRegistryModel = {
                    ipv4: aEntry.data,
                    host: aEntry.name,
                    ptr: txtEntry.name,
                    priority: srvData.priority,

                    srv_port: srvData.port,
                    srv_host: srvData.target,
                    srv_priority: srvData.priority,
                    srv_weight: srvData.weight,

                    api_proto: apiInfo["api_proto"],
                    api_auth: apiInfo["api_auth"],
                    api_ver: apiInfo["api_ver"],
                }

                // iterate over regsitries and select suitable one
                // see https://specs.amwa.tv/is-04/releases/v1.3/docs/3.1._Discovery_-_Registered_Operation.html
                // also check if the new registry is "more suitable" than the old one?
                this.selectedRegistry = registryModel;
                this.onFoundNewRegistry();

                // register resources in regsiterz

            }
        });

        this.performMdnsQuery( mdns );
    }

    private performMdnsQuery( mdns ){

        const registryServiceType = '_nmos-register._tcp.local';

        const query = {
            questions: [{
                name: registryServiceType,
                type: 'PTR'
            }]
        };

        mdns.query(query);
    }

    // is called internally if the mdns client got an dns answer matching a nmos registry
    private onFoundNewRegistry() {
        // stop "old" heartbeat
        this.stopHeartbeat();

        // emit message to all registered observers?
        // TODO

        // register the locally saved node to the registry
        this.postNodeToRegistry();
    }

    private postNodeToRegistry() {
        // build registration URL

        if (this.nmosNode != null && this.selectedRegistry != null) {
            const url: URL = new URL("http://" + this.selectedRegistry.ipv4);
            url.pathname = this.REGISTER_RESOURCE_PATH;

            axios.post(url.toString(), {
                type: 'node',
                data: this.nmosNode.getModel()
            })
                .then( response => {
                    this.startHeartbeat();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    // implement on and emit functions accordingly?

    private startHeartbeat() {
        console.log("Starting Heartbeat!");
        this.performHeartbeat();
    }

    private performHeartbeat(){
        const url: URL = new URL("http://" + this.selectedRegistry.ipv4);
        url.pathname = this.HEALTH_CHECK_PATH + this.nmosNode.getId() ;

        let requestStart: Date = new Date();
        console.log( "Perform Heartbeat");
        

        axios.post(url.toString() 
        )
        .then((response) => {
            console.log(response.status);
            setTimeout( ()=> {
                this.performHeartbeat();
            }, this.HEARTBEAT_INTERVAL_IN_S * 1000 );
        })
        .catch((error) => {
            console.log("Request Error!");
            console.log( error );
            console.log( this.nmosNode.getId() );
            this.stopHeartbeat();
        });

    }

    private stopHeartbeat() {
        console.log("Stoping Heartbeat");
        // do something?
    }
}