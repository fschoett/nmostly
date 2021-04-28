import { INodeApiConfig, NodeApi } from './api/node-api';
import { IDeviceConfig } from './resources/device/i-device-config';
import { IReceiverAudioConfig } from './resources/receiver';
import { ISenderConfig } from './resources/sender';
import { ISourceConfig } from './resources/source';
import { MdnsService } from './services/mdns-service';
import { NmosRegistryHttpService } from './services/nmos-registry-http-service';

const nodeConfig: INodeApiConfig = {
    description: "Schoettlers first Node instance",
    hostname: "fs-tower",
    href: "http://localhost",
    label: "FS-FIRST-NODE",
    tags: []
};

const nodeApi = new NodeApi( nodeConfig );

const newDevice:  IDeviceConfig = {
    description: "Description",
    label: "first/device",
    tags: {}
};
const newDeviceId = nodeApi.addDevice( newDevice );

const firstReceiver:  IReceiverAudioConfig= {
    label: "reciever/1",
    description: "Receiver Description",
    device_id: newDeviceId,
    tags: {},
    caps: {}
};
const newReceiverId = nodeApi.addReceiverAudio( firstReceiver, newDeviceId );

const firstSource: ISourceConfig = {
    label: "/home/source/1",
    description: "First Source Description",
    tags: {},

    device_id: newDeviceId,
    parents: [],
    clock_name: null,
};
const newSourceId = nodeApi.addSource( firstSource, newDeviceId );

let flowId = nodeApi.node.getSource( newSourceId ).flow.id

const newSender: ISenderConfig = {
    label: "/home/sender/1",
    description: "First Sender Description",
    tags: {},

    device_id: newDeviceId,
    flow_id: flowId
};
nodeApi.addSender( newSender, flowId );

// nodeApi.addSender( newDeviceId, newSender );

async function startup(){
    await nodeApi.start();
    console.log( "Started Node!");

    let nmosHttpClient = new NmosRegistryHttpService();
    let mdnsService = new MdnsService( nmosHttpClient );
    mdnsService.registerAllResources( nodeApi.node  );
}

startup();
