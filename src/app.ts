import { NodeApi } from './api/node-api';
import { DeviceConfig } from './models/device/device-config';
import { ReceiverConfig } from './models/receiver/receiver-config';
import { SenderConfig } from './models/sender/sender-config';
import { SourceConfig } from './models/source/source-config';


const nodeApi = new NodeApi( { memeber1: "1234"});

const newDevice:  DeviceConfig = {
    label : "New Label"
};
const newDeviceId = nodeApi.addDevice( newDevice );

const firstReceiver: ReceiverConfig = {
    description: "First Receiver Description",
    deviceId: newDeviceId,
    format: "123",
    label: "/home/receiver/1"

};
const newReceiverId = nodeApi.addReceiver( firstReceiver, newDeviceId );

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
