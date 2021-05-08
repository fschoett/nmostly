import axios from "axios";

import { IMdnsAnswer, IMdnsRegistryModel } from ".";
import { IMdnsServiceConfig } from "./interfaces/i-mdns-service-config";

const multicastdns = require("multicast-dns");



export class MdnsService {
    private readonly REGISTRY_SERVICE_NMAE = '_nmos-register._tcp.local';

    private REGISTER_RESOURCE_PATH = "/x-nmos/registration/v1.3/resource";
    private HEALTH_CHECK_PATH = "/x-nmos/registration/v1.3/health/nodes/";
    private HEARTBEAT_INTERVAL_IN_S: number = 5;
    private selectedRegistry: IMdnsRegistryModel;

    private onNewRegisteryFoundCallback;
    private nodeId: string;

    private registryList : IMdnsRegistryModel[] = [];

    constructor(config: IMdnsServiceConfig) {
        // await service discovery
        this.onNewRegisteryFoundCallback = config.onNewRegistryFound || (() => { console.log("registryfoundcallback not implemented"); });
        this.startMdnsService();
    }

    public getHref() {
        return this.selectedRegistry.ipv4;
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


        mdns.on('response', res => {

            // Only process response if answer containd ptr entry with correct name entry
            if (!this.containsPTREntry(res.answers)) {
                console.log("No ptr entries in res.answers!");
                return;
            }

            const foundRegistryInAnswer = this.tryExtractRegistryFromAnswers(res.answers);
            if ( foundRegistryInAnswer ) {
                let foundRegistry = this.registryList.find( currReg => currReg.host === foundRegistryInAnswer.host );
                if( foundRegistry ){
                    console.log( "Registry alread in regsitry list.. skipping" );
                    return;
                }
                else{
                    this.registryList.push( foundRegistryInAnswer );
                    console.log( "Found new Registry in Answer: ", foundRegistryInAnswer );
                    return;
                }
            }

            const foundRegistryInAdditionals = this.tryExtractRegistryFromAdditionals( res.additionals );
            if( foundRegistryInAdditionals ){
                console.log( "Found Registry in Additionals!", foundRegistryInAdditionals );
            }


            // iterate over regsitries and select suitable one
            // see https://specs.amwa.tv/is-04/releases/v1.3/docs/3.1._Discovery_-_Registered_Operation.html
            // also check if the new registry is "more suitable" than the old one?
            // this.selectedRegistry = registryModel;
            // this.onNewRegisteryFoundCallback(this.selectedRegistry);
            // register resources in regsiterz

        });

        setTimeout(() => {
            this.performMdnsQuery(mdns);
        }, 1000);

    }

    private containsPTREntry(entryList: IMdnsAnswer[]): boolean {
        if (!entryList) { return false }

        let ptrList = entryList.filter(entry => entry.type === "PTR" && entry.name === this.REGISTRY_SERVICE_NMAE);
        return (ptrList.length > 0)
    }

    private tryExtractRegistryFromAnswers(mdnsAnswers: IMdnsAnswer[]): IMdnsRegistryModel {
        console.log("Trying to extract registry from answer: ");
        
        let ptrList = mdnsAnswers.filter(entry => entry.type === "PTR" && entry.name === this.REGISTRY_SERVICE_NMAE);
        let fullName = ptrList[0].data;

        let srvList = mdnsAnswers.filter(entry => entry.type === "SRV" && entry.name === fullName);
        if (srvList.length < 1) { return; }

        let domainName = srvList[0].data.target;
        let port = srvList[0].data.port;

        let aList = mdnsAnswers.filter(entry => entry.type == "A" && entry.name === domainName);
        if (aList.length < 1) { return; }

        let ipAddr = aList[0].data;

        let txtEntry = mdnsAnswers.filter(entry => entry.type === "TXT" && entry.name === fullName);

        let txtDataObj = this.parseTxtDataString( txtEntry[0].data.toString() );

        const apiInfo = {
            api_proto: txtDataObj.apiProto || "http",
            api_ver: txtDataObj.apiVer || ["v1.3"],
            api_auth: txtDataObj.apiAuth || false,
            api_pri: txtDataObj.apiPri
        };

        return {
            ipv4: ipAddr,
            host: domainName,
            ptr: fullName,
            priority: apiInfo.api_pri,

            srv_port: srvList[0].data.port,
            srv_host: srvList[0].data.target,
            srv_priority: srvList[0].data.priority,
            srv_weight: srvList[0].data.weight,

            api_proto: apiInfo.api_proto,
            api_auth: apiInfo.api_auth,
            api_ver: apiInfo.api_ver
        }
    }

    private tryExtractRegistryFromAdditionals(mdnsAdditionals: IMdnsAnswer[]): IMdnsRegistryModel {
        const txtEntry = mdnsAdditionals.find(el => el.type === 'TXT');
        const aEntry = mdnsAdditionals.find(el => el.type === 'A');
        const srvEntry = mdnsAdditionals.find(el => el.type === 'SRV');

        if (!(txtEntry && aEntry && srvEntry)) { return; }

        const srvData = srvEntry.data;

        let txtDataObj = this.parseTxtDataString( txtEntry.data.toString() );

        const apiInfo = {
            api_proto: txtDataObj.apiProto || "http",
            api_ver: txtDataObj.apiVer || ["v1.3"],
            api_auth: txtDataObj.apiAuth || false,
            api_pri: txtDataObj.apiPri
        };

        return {
            ipv4: aEntry.data,
            host: aEntry.name,
            ptr: txtEntry.name,
            priority: apiInfo.api_pri,

            srv_port: srvData.port,
            srv_host: srvData.target,
            srv_priority: srvData.priority,
            srv_weight: srvData.weight,

            api_proto: apiInfo["api_proto"],
            api_auth: apiInfo["api_auth"],
            api_ver: apiInfo["api_ver"],
        }
    }

    private parseTxtDataString( txtDataString: string ){
        const protoIndex = txtDataString.indexOf( "api_proto");
        const verIndex = txtDataString.indexOf( "api_ver");
        const authIndex = txtDataString.indexOf( "api_auth");
        const priIndex = txtDataString.indexOf( "pri");

        const apiProto = txtDataString.substring( protoIndex, verIndex -1 ).split( "=")[1];
        const apiVer   = txtDataString.substring( verIndex,   authIndex-1 ).split( "=")[1].split(",");
        const apiAuthString  = txtDataString.substring( authIndex,  priIndex -1 ).split( "=")[1];
        const apiPriString   = txtDataString.substring( priIndex,   txtDataString.length ).split( "=")[1];
        let apiAuth  = apiAuthString == "true";
        let apiPri = parseInt( apiPriString );

        return{ apiProto, apiVer, apiAuth, apiPri}
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