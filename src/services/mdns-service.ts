import { IMdnsRegistryModel } from "./i-mdns-registry-model";
import { IMdnsAnswer } from "./i-mdns-response-answer";

import { Node } from "../resources/node";

import axios, { AxiosResponse } from "axios";
import { NmosRegistryHttpService } from "./nmos-registry-http-service";

const multicastdns = require('multicast-dns');

export class MdnsService {

    private REGISTER_RESOURCE_PATH = "/x-nmos/registration/v1.3/resource";
    private HEALTH_CHECK_PATH = "/x-nmos/registration/v1.3/health/nodes/";
    private HEARTBEAT_INTERVAL_IN_S: number = 5;
    private selectedRegistry: IMdnsRegistryModel;
    private nmosNode: Node;

    private nmosRegistryService: NmosRegistryHttpService;

    constructor(nmosRegistryService: NmosRegistryHttpService) {

        this.nmosRegistryService = nmosRegistryService;

        // start mdns service
        // query for nmos services and register callback
        this.startServiceDiscovery();
    }

    public registerAllResources(node: Node) {
        // save node as local instance!
        this.nmosNode = node;

        if (this.nmosRegistryService.registryHost) {
            this.postNodeToRegistry();
        }
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
                console.log(registryEntries, additionals);
                const txtEntry = additionals.find(el => el.type === 'TXT');
                const aEntry = additionals.find(el => el.type === 'A');
                const srvEntry = additionals.find(el => el.type === 'SRV');
                const nSec = additionals.filter(el => el.type === 'NSEC');

                console.log(txtEntry);
                console.log(aEntry);
                console.log(srvEntry);

                if (!(txtEntry && aEntry && srvEntry)) {
                    console.log("Additionals are empty.. perform new mdns query");
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
                this.onFoundNewRegistry();

                // register resources in regsiterz

            }
        });

        this.performMdnsQuery(mdns);
    }

    private performMdnsQuery(mdns) {

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
        // this.stopHeartbeat();

        // emit message to all registered observers?
        // TODO

        // register the locally saved node to the registry
        // this.postNodeToRegistry();
        this.nmosRegistryService.registryHost = this.selectedRegistry.ipv4;
        console.log(this.nmosRegistryService.registryHost);

        if (!this.nmosRegistryService.registryHost) {
            console.error("Did not find suitable ipv4!");
            return;
        }


        this.postAllResourcesToRegistry();
    }


    private async postAllResourcesToRegistry() {
        await this.postNodeToRegistry();
        await this.postDevicesToRegistry();
        await this.postSourcesToRegistry();
        await this.postFlowsToRegistry();
        await this.postSendersToRegistry();
        await this.postReceiversToRegistry();
    }

    private async postNodeToRegistry() {
        await this.nmosRegistryService.postResource(this.nmosNode.getModel(), "node");
        this.startHeartbeat();
    }

    private async postDevicesToRegistry() {
        const deviceModels = this.nmosNode.getAllDeviceModels();
        deviceModels.forEach(async device => {
            await this.nmosRegistryService.postResource(device, "device")
        });
    }

    private async postSourcesToRegistry() {
        const sourceModels = this.nmosNode.getAllSourceModels();
        sourceModels.forEach(async source => {
            await this.nmosRegistryService.postResource(source, "source");
        });
    }

    private postReceiversToRegistry() {
        const receiverModels = this.nmosNode.getAllReceiverModels();
        receiverModels.forEach(async receiver => {
            await this.nmosRegistryService.postResource(receiver, "receiver");
        });
    }

    private postSendersToRegistry() {
        const senderModels = this.nmosNode.getAllSenderModels();
        senderModels.forEach(async sender => {
            await this.nmosRegistryService.postResource(sender, "sender");
        });
    }

    private postFlowsToRegistry() {
        const flowModels = this.nmosNode.getAllFlowModels();
        flowModels.forEach(async flow => {
            await this.nmosRegistryService.postResource(flow, "flow");
        });
    }

    private nodeAndOrRegistryIsNull(): boolean {
        // TODO: Check if parantheses can be omitted!
        return (this.nmosNode == null || this.selectedRegistry == null);
    }

    private startHeartbeat() {
        console.log("Starting Heartbeat!");
        this.performHeartbeat();
    }

    private performHeartbeat() {
        const url: URL = new URL("http://" + this.selectedRegistry.ipv4);
        url.pathname = this.HEALTH_CHECK_PATH + this.nmosNode.getId();

        let requestStart: Date = new Date();
        console.log("Perform Heartbeat");


        axios.post(url.toString()
        )
            .then((response) => {
                console.log(response.status);
                setTimeout(() => {
                    this.performHeartbeat();
                }, this.HEARTBEAT_INTERVAL_IN_S * 1000);
            })
            .catch((error) => {
                console.log("Request Error!");
                console.log(error);
                console.log(this.nmosNode.getId());
                this.stopHeartbeat();
            });

    }

    private stopHeartbeat() {
        console.log("Stoping Heartbeat");
        // do something?
    }
}