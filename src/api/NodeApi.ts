import { IDeviceModel, IDeviceModelConfig } from "../models/Interfaces/i-device-model";
import { IFlowModel, IFlowModelConfig } from "../models/Interfaces/i-flow-model";
import { INodeModel } from "../models/Interfaces/i-node-model";
import { IReceiverModel } from "../models/Interfaces/i-receiver-model";
import { ISenderModel } from "../models/Interfaces/i-sender-model";
import { ISourceModel, ISourceModelConfig } from "../models/Interfaces/i-source-model";
import { AppService } from "../services/app-service";
import { IMdnsClientService } from "../services/i-mdns-client-service";

import express from "express";
import { NodeModel } from "../models/node-model";
import { DeviceModel } from "../models/_old/device-model";
import { IAppService } from "../services/i-app-service";
import { SourceModel } from "../models/source-model";
import { FlowModel } from "../models/flow-model";

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


    private self: INodeModel;
    private sources: ISourceModel[];
    private flows: IFlowModel[];
    private devices: IDeviceModel[];
    private senders: ISenderModel[];
    private receiver: IReceiverModel[];

    private appService: IAppService;

    constructor(config: INodeApiConfig) {
        this.config = config;

        this.appService = new AppService();
        this.self = new NodeModel( this.appService, "some label", "href");
        this.sources = [];
        this.flows = [];
        this.devices = [];
        this.senders = [];
        this.receiver = [];
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
            res.json(this.self);
        });

        // List devices
        nodeApiRouter.get('/devices/', (req, res) => {
            res.json(this.devices);
        });

        // Get a single device
        nodeApiRouter.get('/devices/:id', (req, res) => {
            res.json(this.devices);
        });

        // List sources
        nodeApiRouter.get('/sources/', (req, res) => {
            res.json(this.sources);
        });

        // Get a single source
        nodeApiRouter.get('/sources/:id', (req, res) => {
            let foundSource = this.sources.find( currSource => currSource.id === req.params.id );
            if( foundSource ){ res.json( foundSource )}
            else{ res.sendStatus( 404 )}
        });

        // List flows
        nodeApiRouter.get('/flows/', (req, res) => {
            res.json(this.flows);
        });

        // Get a single flow
        nodeApiRouter.get('/flows/:id', (req, res) => {
            res.json(this.flows);
        });

        // List senders
        nodeApiRouter.get('/senders/', (req, res) => {
            res.json(this.senders);
        });

        // Get a single sender
        nodeApiRouter.get('/senders/:id', (req, res) => {
            res.json(this.senders);
        });

        // List receivers
        nodeApiRouter.get('/receivers/', (req, res) => {
            res.json(this.receiver);
        });

        // Get a single receiver
        nodeApiRouter.get('/receivers/:id', (req, res) => {
            res.json(this.receiver);
        });

        app.listen(5432, () => {
            console.log("Started second expresss server. what will happen??");

        });
        return false;
    }

    /**
     * addSource
     */
    public addSource( sourceConfig: ISourceModelConfig ): string {
        // Message someone?

        let newSource = new SourceModel( this.appService, sourceConfig );
        this.sources.push( newSource );
        return newSource.id;
    }

    /**
     * addFlow
     */
    public addFlow( newFlowConfig: IFlowModelConfig ) {
        const newFlow = new FlowModel( this.appService, newFlowConfig );
        const sourceId = newFlowConfig.source_id;
        /*
        const deviceId = this.self.getDeviceList().find( currDevice => {
            currDevice.sourceList.find( currSource => {
                currSource.id === sourceId;
            })
        });
        */
        this.flows.push(  newFlow );
    }

    /**
     * addDevice
     */
    public addDevice( deviceConfig: IDeviceModelConfig ): string {
        // lame factory?
        let newDevice = new DeviceModel( this.appService, deviceConfig );
        newDevice.node_id = this.self.id;
        this.devices.push( newDevice );
        return newDevice.id;
    }

    /**
     * addSender
     */
    public addSender( newSender: ISenderModel ) {
        this.senders.push( newSender );
    }

    /**
     * addReceiver
     */
    public addReceiver( newReceiver: IReceiverModel ) {
        this.receiver.push( newReceiver );
    }


    public getId(){ return this.self.id }

}