import { IMdnsAnswer, IMdnsRegistryModel } from "../discovery-service";

const REGISTRY_SERVICE_NAME = '_nmos-register._tcp.local';

export function parseMdnsResponse(response): IMdnsRegistryModel {

    // try extract from answer.
    try {
        const answerRegistry = tryExtractRegistryFromAnswers( response );
        if( answerRegistry ){ return answerRegistry; }
    } catch (error) {
        console.error( error );
    }

    try {
        // if nothing found, try extract from additionals
        return tryExtractRegistryFromAdditionals( response );
        
    } catch (error) {
        console.error( error );
    }
}

export function containsPTREntry(response): boolean {
    if (!response.answers) { return false }

    let ptrList = response.answers
        .filter(entry => entry.type === "PTR" && entry.name === REGISTRY_SERVICE_NAME);

    return (ptrList.length > 0)
}

function tryExtractRegistryFromAnswers( response ): IMdnsRegistryModel {
    const mdnsAnswers = response.answers as IMdnsAnswer[] ;

    let ptrList = mdnsAnswers.filter(entry => entry.type === "PTR" && entry.name === REGISTRY_SERVICE_NAME );
    let fullName = ptrList[0].data;

    let srvList = mdnsAnswers.filter(entry => entry.type === "SRV" && entry.name === fullName);
    if (srvList.length < 1) { return; }

    let domainName = srvList[0].data.target;
    let port = srvList[0].data.port;

    let aList = mdnsAnswers.filter(entry => entry.type == "A" && entry.name === domainName);
    if (aList.length < 1) { return; }

    let ipAddr = aList[0].data;

    let txtEntry = mdnsAnswers.filter(entry => entry.type === "TXT" && entry.name === fullName);

    let txtDataObj = parseTxtDataString(txtEntry[0].data.toString());

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

function tryExtractRegistryFromAdditionals( response ): IMdnsRegistryModel {
    
    const mdnsAdditionals: IMdnsAnswer[] = response.additionals;

    const txtEntry = mdnsAdditionals.find(el => el.type === 'TXT');
    const aEntry = mdnsAdditionals.find(el => el.type === 'A');
    const srvEntry = mdnsAdditionals.find(el => el.type === 'SRV');

    if (!(txtEntry && aEntry && srvEntry)) { return; }

    const srvData = srvEntry.data;

    let txtDataObj = parseTxtDataString(txtEntry.data.toString());

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

function parseTxtDataString(txtDataString: string){
    console.log( txtDataString );
    const protoIndex = txtDataString.indexOf("api_proto");
    const verIndex = txtDataString.indexOf("api_ver");
    const authIndex = txtDataString.indexOf("api_auth");
    const priIndex = txtDataString.indexOf("pri");

    const apiProto = txtDataString.substring(protoIndex, verIndex - 1).split("=")[1];
    const apiVer = txtDataString.substring(verIndex, authIndex - 1).split("=")[1].split(",");
    const apiAuthString = txtDataString.substring(authIndex, priIndex - 1).split("=")[1];
    const apiPriString = txtDataString.substring(priIndex, txtDataString.length).split("=")[1];
    let apiAuth = apiAuthString == "true";
    let apiPri = parseInt(apiPriString);

    const allData = txtDataString.split( ",");
    const newApiVer = [ allData.find( el => el.includes( "api_ver") ).split( "=")[1] ];
    const newApiProto = allData.find( el => el.includes( "api_proto") ).split( "=")[1]
    const newApiPri = parseInt( allData.find( el => el.includes( "pri")).split( "=")[1] );


    return { 
        apiProto: newApiProto,
        apiVer : newApiVer,
        apiAuth,
        apiPri: newApiPri
    }
}

/*
    private containsPTREntry(entryList: IMdnsAnswer[]): boolean {
        if (!entryList) { return false }

        let ptrList = entryList.filter(entry => entry.type === "PTR" && entry.name === this.REGISTRY_SERVICE_NMAE);
        return (ptrList.length > 0)
    }
    */