import express from "express";

import { IMdnsClientService } from "../services/i-mdns-client-service";
import { IAppService } from "../services/i-app-service";
import { AppService } from "../services/app-service";

import { Node,   INodeModel,   INodeConfig} from "../models/node";
import { Device, IDeviceModel, IDeviceConfig} from "../models/device";
import { Sender, SenderModel, SenderConfig } from "../models/sender";
import { Receiver, IReceiverModel,  IReceiverConfig} from "../models/receiver";
import { Source, SourceModel, SourceConfig } from "../models/source";
import { Flow,   IFlowModel,   IFlowConfig   } from "../models/flow";

interface INodeApiConfig {
    memeber1: string;
}

export class NodeApiConfig implements INodeApiConfig {
    memeber1: string;

}

export class NodeApi {

    private config;
    private logger;
    private mdnsClient: IMdnsClientService;


    private self: Node;
    private appService: IAppService;

    constructor(config: INodeApiConfig) {
        this.config = config;
        this.appService = new AppService();
        
        const nodeConfig: INodeConfig = {
            description : "Node",
            hostname: "Hostname",
            href: "HREF",
            label: "NodeName",
            tags: {}
        }

        this.self = new Node(this.appService, nodeConfig );
        this.mdnsClient = this.appService.mdnsService;
    }

    public async start(): Promise<boolean> {
        const registeredNode = await this.mdnsClient.registerNode();
        // Start express server!
        const app = express();

        app.use((req, res, next) => {
            // TODO enhance this to better supports CORS
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, HEAD, OPTIONS, DELETE");
            res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
            res.header("Access-Control-Max-Age", "3600");

            if (req.method == 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        app.get("/", (req, res) => {
            res.json(["x-nmos/"]);
        });

        app.get("/x-nmos/", (req, res) => {
            res.json(["node/"]);
        });

        app.get("/x-nmos/node/", (req, res) => {
            res.json(["v1.3/"]);
        });

        const nodeApiRouter = express();

        app.use("/x-nmos/node/v1.3/", nodeApiRouter);

        nodeApiRouter.get("/", (req, res) => {
            res.json(["self/", "sources/", "flows/", "devices/", "senders/", "receivers/"]);
        });


        nodeApiRouter.get('/self/', (req, res) => {
            res.json(this.self.getModel());
        });

        // List devices
        nodeApiRouter.get('/devices/', (req, res) => {
            res.json(this.self
                .getDeviceList()
                .map(currDevice => currDevice.getModel())
            );
        });

        // Get a single device
        nodeApiRouter.get('/devices/:id', (req, res) => {
            res.json(this.self
                .getDevice(req.params.id)
                .getModel()
            );
        });

        // List sources
        nodeApiRouter.get('/sources/', (req, res) => {
            let sourceModels: SourceModel[] = this.self
                .getDeviceList()
                .map(currDevice => currDevice.getSourceModels())
                .reduce((acc, curr) => acc.concat(curr));

            res.json(sourceModels);
        });

        // Get a single source
        nodeApiRouter.get('/sources/:id', (req, res) => {
            const foundSource = this.findSource(req.params.id);

            if (foundSource) { res.json(foundSource.getModel()) }
            else { res.sendStatus(404) }
        });

        // List flows
        nodeApiRouter.get('/flows/', (req, res) => {
            let foundFlows: IFlowModel[] = this.self
                .getDeviceList()
                .map(device => device.getFlowModels())
                .reduce((acc, curr) => acc.concat(curr));

            res.json(foundFlows);
        });

        // Get a single flow
        nodeApiRouter.get('/flows/:id', (req, res) => {
            let flowList: Flow[] = this.self
                .getDeviceList()
                .map(device => device.getSourceList().map(source => source.flow))
                .reduce((acc, curr) => acc.concat(curr));

            let foundFlow: Flow = flowList.find(flow => flow.id === req.params.id);

            if (foundFlow) { res.json(foundFlow.getModel()) }
            else { res.sendStatus(404) }
        });

        // List senders
        nodeApiRouter.get('/senders/', (req, res) => {
            res.json(this.self.getDeviceList()
                .map(device => device.getSenderModels())
                .reduce((acc, curr) => acc.concat(curr))
            );
        });

        // Get a single sender
        nodeApiRouter.get('/senders/:id', (req, res) => {
            const senderList: Sender[] = this.self.getDeviceList()
                .map(device => device.getSenderList())
                .reduce((acc, curr) => acc.concat(curr));

            const foundSender = senderList
                .find(sender => sender.id === req.params.id);

            if (foundSender) { res.json(foundSender) }
            else { res.sendStatus(404) }
        });

        // List receivers
        nodeApiRouter.get('/receivers/', (req, res) => {
            res.json(this.self.getDeviceList()
                .map(device => device.getReceiverModels())
                .reduce((acc, curr) => acc.concat(curr))
            );
        });

        // Get a single receiver
        nodeApiRouter.get('/receivers/:id', (req, res) => {
            const receiverList: Receiver[] = this.self.getDeviceList()
                .map(device => device.getReceiverList())
                .reduce((acc, curr) => acc.concat(curr));

            const foundReceiver = receiverList
                .find(sender => sender.id === req.params.id);

            if (foundReceiver) { res.json(foundReceiver.getModel()) }
            else { res.sendStatus(404) }
        });

        app.listen(5432, () => {
            console.log("Started NMOS Server");
        });

        return false;
    }


    // PUBLIC API
    public addDevice(config: IDeviceConfig): string {
        let newDevice = new Device(this.appService, config, this.self.getId());
        this.self.addDevice(newDevice);
        return newDevice.id;
    }

    public addSource(sourceConfig: SourceConfig, deviceId: string): string {
        const newSource = new Source(this.appService, sourceConfig);

        this.self.getDeviceList()
            .find(device => device.id === deviceId)
            .addSource(newSource);

        return newSource.id;
    }

    public addSender(config: SenderConfig, flowId: string): string {
        let flowList: Flow[] = this.self
            .getDeviceList()
            .map(device => device.getSourceList().map(source => source.flow))
            .reduce((acc, curr) => acc.concat(curr));

        let foundFlow: Flow = flowList.find(flow => flow.id === flowId);

        if (foundFlow) {
            // create new sender
            // add flow to sender
            const newSender = new Sender(this.appService, config);
            this.self.getDevice(foundFlow.device_id).addSender(newSender);
            return newSender.id;
        }
    }

    public addReceiver(config: IReceiverConfig, deviceId: string) {
        const newReceiver = new Receiver(this.appService, config);

        const foundDevice = this.self.getDevice(deviceId)
        if (foundDevice) {
            foundDevice.addReceiver(newReceiver);
        }
    }


    public findSource(sourceId: string): Source {
        let foundSource: Source;
        let deviceList = this.self.getDeviceList();
        deviceList.every(device => {
            foundSource = device
                .getSourceList()
                .find(source => source.id === sourceId);

            if (foundSource)
                return false
            else
                return true;
        });
        return foundSource;
    }

}