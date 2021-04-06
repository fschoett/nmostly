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

};
const newReceiverId = nodeApi.addReceiver( firstReceiver, newDeviceId );

const firstSource: SourceConfig = {
};
const newSourceId = nodeApi.addSource( firstSource, newDeviceId );

let flowId = nodeApi.findSource( newSourceId ).flow.id

const newSender: SenderConfig = {

};
nodeApi.addSender( newSender, flowId );

// nodeApi.addSender( newDeviceId, newSender );

async function startup(){
    await nodeApi.start();
    console.log( "Started Node!");
}

startup();
