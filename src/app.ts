import { IReceiverAudioConfig } from "./resources/receiver";
import { IDeviceConfig } from "./resources/device";
import { ISenderConfig } from "./resources/sender";
import { ISourceConfig } from "./resources/source";
import { INodeConfig } from "./resources/node";
import { NmosMediator } from "./api";

const nodeConfig: INodeConfig = {
    description: "Schoettlers first Node instance",
    hostname: "fs-tower",
    href: "http://127.0.0.1:5500/",
    label: "FS-FIRST-NODE",
    tags: ["debug_node"],
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
        {
            href: "http://127.0.0.1:5500/",
            type: "urn:x-nmos:service:storequery"
        }
    ],
    clocks: [
        {
            name: "clk0",
            ref_type: "internal"
        }
    ],
    interfaces: [
        {
            chassis_id: "Ethernet 3",
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
    tags: {}
};
const newDeviceId = nodeApi.addDevice(newDevice);

const firstReceiver: IReceiverAudioConfig = {
    label: "reciever/1",
    description: "Receiver Description",
    device_id: newDeviceId,
    tags: {},
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
const newSourceId = nodeApi.addSource(firstSource, newDeviceId);

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
}

startup();
