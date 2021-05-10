import { NmosMediator } from "./src/api";

const nodeApi = new NmosMediator({
    ifaceName: "eth0",
    ipv4: "192.168.178.41",
    macAddr: "74-D4-35-BB-25-1C",
    port: 5500
});

nodeApi.addReceiverAudio();

const newSourceId = nodeApi.addAudioSource();
const flowId = nodeApi.getNode().getSource(newSourceId).getFlow().id;

nodeApi.addSender( { flow_id: flowId });

nodeApi.startServer();