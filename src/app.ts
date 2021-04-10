import { NodeApi } from './api/node-api';
import { IDeviceConfig } from './models/device/i-device-config';
import { IReceiverAudioConfig } from './models/receiver';
import { IReceiverConfig } from './models/receiver/i-receiver-config';
import { SenderConfig } from './models/sender/sender-config';
import { SourceConfig } from './models/source/source-config';


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

const firstSource: SourceConfig = {
    description: "First Source Description",
    device_id: newDeviceId,
    label: "/home/source/1"
};
const newSourceId = nodeApi.addSource( firstSource, newDeviceId );

let flowId = nodeApi.findSource( newSourceId ).flow.id

const newSender: SenderConfig = {
    description: "First Sender Description",
    device_id: newDeviceId,
    label: "/home/sender/1",
    flow_id: flowId
};
// nodeApi.addSender( newSender, flowId );

// nodeApi.addSender( newDeviceId, newSender );

async function startup(){
    await nodeApi.start();
    console.log( "Started Node!");
}

startup();
