

// use axios

const { default: axios } = require("axios");

async function sendMyNode() {
    try {

        const res = await axios.post('http://192.168.178.101/x-nmos/registration/v1.3/resource/',
            {
                data: {
                    api: {
                        endpoints: [{
                            host: "127.0.0.1",
                            port: 5500,
                            protocol: "http"
                        }
                        ],
                        versions: ["v1.3"]
                    },
                    caps: {},
                    clocks: [{
                        name: "clk0",
                        ref_type: "internal"
                    }
                    ],
                    description: "Schoettlers first Node instance",
                    hostname: "test",
                    href: "http://127.0.0.1:5500/",
                    id: "e3d9e67b-95c7-426d-a239-e37fdafe68f2",
                    interfaces: [{
                        chassis_id: "74-d4-35-bb-25-1c",
                        name: "eth0",
                        port_id: "74-d4-35-bb-25-1c",
                        attached_network_device: {
                            chassis_id: "74-D4-35-BB-25-1C",
                            port_id: "eth0"
                        }
                    }
                    ],
                    label: "FS-FIRST-NODE",
                    services: [],
                    tags: {},
                    version: "1620408582788:000000000"
                },
                type: "node"

            });
        console.log(res.data);
    } catch (error) {
        console.log(error.response.data);
    }
}

async function sendExampleNode() {
    try {
        const res = await axios.post('http://192.168.178.101/x-nmos/registration/v1.3/resource/', {
            type: "node",
            data: {
                version: "1620408582788:000000000",
                hostname: "host1",
                label: "FS-FIRST-NODE",
                description: "Schoettlers first Node instance",
                tags: {},
                href: "http://127.0.0.1:5500/",
                api: {
                    versions: ["v1.3"],
                    endpoints: [
                        {
                            host: "127.0.0.1",
                            port: 12345,
                            protocol: "http"
                        }
                    ]
                },
                services: [
                ],
                caps: {},
                id: "e3d9e67b-95c7-426d-a239-e37fdafe68f2",
                clocks: [
                    {
                        name: "clk0",
                        ref_type: "internal"
                    }
                ],
                interfaces: [
                    {
                        chassis_id: "74-d4-35-bb-25-1c",
                        name: "eth0",
                        port_id: "74-d4-35-bb-25-1c",
                    }
                ]
            }
        });
        console.log(res.data );
    } catch (error) {
        console.log(error.response.data);
    }
}

// sendMyNode();
sendExampleNode();
