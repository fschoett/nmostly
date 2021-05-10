const Nmostly = require( "./dist").default;

const nodeApi = new Nmostly( {
    ifaceName: "eth0",
    ipv4: "192.168.178.41",
    macAddr: "74-D4-35-BB-25-1C",
    port: 5500
});

nodeApi.addReceiverAudio();
nodeApi.addAudioSource();

nodeApi.startServer();