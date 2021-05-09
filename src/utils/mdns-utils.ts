import { IMdnsAnswer, IMdnsRegistryModel } from "../discovery-service";

const REGISTRY_SERVICE_NAME = '_nmos-register._tcp.local';

export function parseMdnsResponse(response): IMdnsRegistryModel {

    // try extract from mdns answer
    try {
        const answerRegistry = tryExtractRegistryFromAnswers(response);
        if (answerRegistry) { return answerRegistry; }
    } catch (error) {
        console.error(error);
    }

    // if no further information are found, try extract from additionals entry
    try {
        return tryExtractRegistryFromAdditionals(response);

    } catch (error) {
        console.error(error);
    }
}

export function containsPTREntry(response): boolean {
    if (!response.answers) { return false }

    let ptrList = response.answers
        .filter(entry => entry.type === "PTR" && entry.name === REGISTRY_SERVICE_NAME);

    return (ptrList.length > 0)
}

function tryExtractRegistryFromAnswers(response): IMdnsRegistryModel {
    const mdnsAnswers = response.answers as IMdnsAnswer[];

    let ptrList = mdnsAnswers.filter(entry => entry.type === "PTR" && entry.name === REGISTRY_SERVICE_NAME);
    let fullName = ptrList[0].data;

    let srvList = mdnsAnswers.filter(entry => entry.type === "SRV" && entry.name === fullName);
    if (srvList.length < 1) { return; }

    let domainName = srvList[0].data.target;
    let port = srvList[0].data.port;

    let aList = mdnsAnswers.filter(entry => entry.type == "A" && entry.name === domainName);
    if (aList.length < 1) { return; }

    let ipAddr = aList[0].data;

    let txtEntry = mdnsAnswers.filter(entry => entry.type === "TXT" && entry.name === fullName);

    let txtDataObj = parseTxtData(txtEntry[0].data);

    const apiInfo = {
        api_proto: txtDataObj.apiProto || "http",
        api_ver: txtDataObj.apiVer || ["v1.3"],
        api_auth: txtDataObj.apiAuth || false,
        api_pri: txtDataObj.priority || 99
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

function tryExtractRegistryFromAdditionals(response): IMdnsRegistryModel {

    const mdnsAdditionals: IMdnsAnswer[] = response.additionals;

    const txtEntry = mdnsAdditionals.find(el => el.type === 'TXT');
    const aEntry = mdnsAdditionals.find(el => el.type === 'A');
    const srvEntry = mdnsAdditionals.find(el => el.type === 'SRV');

    if (!(txtEntry && aEntry && srvEntry)) { return; }

    const srvData = srvEntry.data;
    let txtDataObj = parseTxtData(txtEntry.data);

    const apiInfo = {
        api_proto: txtDataObj.apiProto || "http",
        api_ver: txtDataObj.apiVer || ["v1.3"],
        api_auth: txtDataObj.apiAuth || false,
        api_pri: txtDataObj.priority || 99
    };

    // Return extracted data as registry
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

// Parse txt entries from the
function parseTxtData(txtData: Buffer[]) {

    // parse txt data entries
    let txtDataEntryObject = {};
    txtData.forEach(txtDataEntry => {
        let currDataEntrySplit = txtDataEntry.toString().split("=");
        txtDataEntryObject[currDataEntrySplit[0]] = currDataEntrySplit[1];
    });

    // make sure that data types are correct
    const apiVer   = txtDataEntryObject[ "api_ver"   ].split(",");
    const apiProto = txtDataEntryObject[ "api_proto" ];
    const apiAuth  = txtDataEntryObject[ "api_auth"  ] == "true";
    const priority = parseInt(txtDataEntryObject["pri"]);

    // return parsed txt entries as object
    return { apiVer, apiProto, apiAuth, priority }
}