import { IReceiverAudioConfig } from "./resources/receiver";
import { IDeviceConfig } from "./resources/device";
import { ISenderConfig } from "./resources/sender";
import { ISourceConfig } from "./resources/source";
import { INodeConfig } from "./resources/node";
import { NmosMediator } from "./api";

const nodeConfig: INodeConfig = {
    description: "Schoettlers first Node instance",
    hostname: "fs-tower.local",
    href: "http://127.0.0.1:5500/",
    label: "FS-FIRST-NODE",
    tags: {},
    api: {
        versions: ["v1.3"],
        endpoints: [
            {
                host: "127.0.0.1",
                port: 5500,
                protocol: "http"
            }
        ]
    },
    services: [
    ],
    clocks: [
        {
            name: "clk0",
            ref_type: "internal"
        }
    ],
    interfaces: [
        {
            chassis_id: "74-D4-35-BB-25-1C",
            name: "eth0",
            port_id: "74-D4-35-BB-25-1C"
        }
    ],
    onUpdateCallback: () => { console.log("Updating NODE") },
};

const nodeApi = new NmosMediator(5500, nodeConfig);

const newDevice: IDeviceConfig = {
    description: "Description",
    label: "first/device",
    tags: {},
    connection_href: "http://192.168.178.41:5500/x-nmos/connection/v1.1"
};
const newDeviceId = nodeApi.addDevice(newDevice);

const firstReceiver: IReceiverAudioConfig = {
    label: "reciever/1",
    description: "Receiver Description",
    device_id: newDeviceId,
    tags: {},
    onUpdateCallback : ()=> { console.log("onUpdateCallback: TopLevel!")}
};
const newReceiverId = nodeApi.addReceiverAudio(firstReceiver, newDeviceId);

const firstSource: ISourceConfig = {
    label: "/home/source/1",
    description: "First Source Description",
    tags: {},

    device_id: newDeviceId,
    parents: [],
    clock_name: null,
};
const newSourceId = nodeApi.addAudioSource(firstSource, newDeviceId);

//let flowId = nodeApi.node.getSource(newSourceId).flow.id
const flowId = nodeApi.getNode().getSource(newSourceId).getFlow().id;

const newSender: ISenderConfig = {
    label: "/home/sender/1",
    description: "First Sender Description",
    tags: {},

    device_id: newDeviceId,
    flow_id: flowId
};
nodeApi.addSender(newSender, flowId);

// nodeApi.addSender( newDeviceId, newSender );

async function startup() {
    await nodeApi.startServer();
    console.log("App: Started server");
    setTimeout( ()=> {
        console.log( "Performing stage!")
        nodeApi.getNode().getAllReceivers()[0].stage({
            activation: {
                mode: "activate_immediate"
            },
            master_enable: true,
            sender_id: "123412341234",
        });
    }, 20000 );
}

startup();
