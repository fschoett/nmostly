import { IMdnsRegistryModel } from "./i-mdns-registry-model";
import { IMdnsAnswer } from "./i-mdns-response-answer";

const multicastdns = require('multicast-dns');

export class MdnsService {


    constructor() {
    }


    public findRegistry() {
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

                const srvData = srvEntry.data;

                const apiInfo = {};

                const txtEntryData = txtEntry.data.forEach((currBuffer: Buffer) => {
                    let currData = currBuffer.toString().split("=");
                    apiInfo[ currData[0] ] = currData[1];
                });
                console.log( apiInfo );

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

                console.log(registryModel);

            }
        });
        mdns.on('query', query => {
            // console.log('query: ', query);
        });
        mdns.query(query);
    }
}