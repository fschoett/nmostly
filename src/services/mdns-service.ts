import { IMdnsRegistryModel } from "./i-mdns-registry-model";
import { IMdnsAnswer } from "./i-mdns-response-answer";

import { Node } from "../models/node";

import axios from "axios";

const multicastdns = require('multicast-dns');

export class MdnsService {

    private REGISTER_RESOURCE_PATH = "/x-nmos/registration/v1.3/resource/";

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

        const query = {
            questions: [{
                name: registryServiceType,
                type: 'PTR'
            }]
        };

        mdns.on('response', res => {
            const registryEntries: IMdnsAnswer[] = res.answers
                .filter(el => el.name === registryServiceType);

            if (registryEntries.length > 0) {
                console.log("Found registry at: ", registryEntries[0].data);

                const additionals: IMdnsAnswer[] = res.additionals;
                const txtEntry = additionals.find(el => el.type === 'TXT');
                const aEntry = additionals.find(el => el.type === 'A');
                const srvEntry = additionals.find(el => el.type === 'SRV');
                const nSec = additionals.filter(el => el.type === 'NSEC');

                console.log( txtEntry );
                console.log( aEntry );
                console.log( srvEntry );

                if( !( txtEntry && aEntry && srvEntry ) ) return;

                let srvData = {
                    priority: 0,
                    target: undefined,
                    port: 80,
                    weight:0
                };
                if( srvEntry ){
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

        // start heartbeat!
        this.startHeartbeat();
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
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    // implement on and emit functions accordingly?

    private startHeartbeat() { }

    private stopHeartbeat() { }
}