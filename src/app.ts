import { NodeApi } from './api/node-api';
import { IDeviceConfig } from './models/device/i-device-config';
import { IReceiverAudioConfig } from './models/receiver';
import { ISenderConfig } from './models/sender';
import { ISourceConfig } from './models/source';
import { MdnsService } from './services/mdns-service';


const nodeApi = new NodeApi( { memeber1: "1234"});

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

    let mdnsService = new MdnsService();
    mdnsService.registerAllResources( nodeApi.node )
}

startup();
