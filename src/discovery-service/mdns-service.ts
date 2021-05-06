import axios from "axios";

import { IMdnsAnswer, IMdnsRegistryModel } from ".";
import { IMdnsServiceConfig } from "./interfaces/i-mdns-service-config";

const multicastdns = require("multicast-dns");



export class MdnsService {
    private REGISTER_RESOURCE_PATH = "/x-nmos/registration/v1.3/resource";
    private HEALTH_CHECK_PATH = "/x-nmos/registration/v1.3/health/nodes/";
    private HEARTBEAT_INTERVAL_IN_S: number = 5;
    private selectedRegistry: IMdnsRegistryModel;

    private onNewRegisteryFoundCallback;
    private nodeId: string;

    constructor(config: IMdnsServiceConfig) {
        // await service discovery
        this.onNewRegisteryFoundCallback = config.onNewRegistryFound || (() => { console.log("registryfoundcallback not implemented"); });
        this.startMdnsService();
    }

    public getHref() {
        return this.selectedRegistry.host;
    }

    // start registry
    // startMdnsService

    private startMdnsService() {
        console.log("MdnsService: startMdnsService");


        const mdns = multicastdns({
            multicast: true,
            interface: "192.168.178.41",
            reuseAddr: true
        });

        const registryServiceType = '_nmos-register._tcp.local';

        mdns.on('response', res => {
            
            const registryEntries: IMdnsAnswer[] = res.answers
                .filter(el => el.name === registryServiceType);



            if (registryEntries.length > 0) {
                console.log("MdnsService: Found registry at: ", registryEntries[0].data);

                const additionals: IMdnsAnswer[] = res.additionals;
                console.log(registryEntries, additionals);
                const txtEntry = additionals.find(el => el.type === 'TXT');
                const aEntry = additionals.find(el => el.type === 'A');
                const srvEntry = additionals.find(el => el.type === 'SRV');
                const nSec = additionals.filter(el => el.type === 'NSEC');

                console.log(txtEntry);
                console.log(aEntry);
                console.log(srvEntry);

                if (!(txtEntry && aEntry && srvEntry)) {
                    console.log("MdnsService: Additionals are empty.. perform new mdns query");
                    this.performMdnsQuery(mdns);
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
                this.onNewRegisteryFoundCallback(this.selectedRegistry);

                // register resources in regsiterz

            }
        });

        this.performMdnsQuery(mdns);
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

    // start heartbeat
    // perform hearbeat
    // stop heartbeat

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
                console.log(error);
                this.stopHeartbeat();
            });

    }

    private stopHeartbeat() {
        console.log("Stoping Heartbeat");
        // do something?
    }
}