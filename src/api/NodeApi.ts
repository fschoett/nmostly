import { IDeviceModel } from "../models/i-device-model";
import { IFlowModel } from "../models/i-flow-model";
import { INodeModel } from "../models/i-node-model";
import { IReceiverModel } from "../models/i-receiver-model";
import { ISenderModel } from "../models/i-sender-model";
import { ISourceModel } from "../models/i-source-model";
import { AppService } from "../services/app-service";
import { IAppService } from "../services/i-app-service";
import { IMdnsClientService } from "../services/i-mdns-client-service";

interface INodeApiConfig{
    memeber1: string;
}

export class NodeApiConfig implements INodeApiConfig{
    memeber1: string;

}

export class NodeApi{

    private config;
    private logger;
    private mdnsClient: IMdnsClientService;

    private self: INodeModel;
    private sources: ISourceModel[];
    private flows: IFlowModel[];
    private devices: IDeviceModel[];
    private senders: ISenderModel[];
    private receiver: IReceiverModel[];

    constructor( config: INodeApiConfig ){
        this.config = config;

        const appService = new AppService();
        this.mdnsClient = appService.mdnsService;
    }

    public async start(): Promise<boolean>{
        const registeredNode = await this.mdnsClient.registerNode();
        // Start express server!
        return false;
    }

    /**
     * addSource
     */
    public addSource() {
        
    }

    /**
     * addFlow
     */
    public addFlow() {
        
    }

    /**
     * addDevice
     */
    public addDevice() {
        
    }


    /**
     * addSender
     */
    public addSender() {
        
    }

    /**
     * addReceiver
     */
    public addReceiver() {
        
    }

}