// Utils and other modules
import { IAppService, AppService } from "../utils";

import { DiscoveryApiController, ConnectionApiController } from "../controllers";
import { CoreRouter } from "../endpoints/core-router";

// Resource Imports
import { IReceiverAudioConfig, ReceiverAudio } from "../resources/receiver";
import { IDeviceConfig, Device } from "../resources/device";
import { ISenderConfig, Sender } from "../resources/sender";
import { ISourceConfig, Source, SourceAudio } from "../resources/source";
import { INodeConfig } from "../resources/node";
import { IFlow } from "../resources/flow/i-flow";
import { Node } from "../resources/node"

// Import mediator interface
import { INmosMediator } from ".";
import { DiscoveryService } from "../discovery-service";



// This module contains the central business logic.
export class NmosMediator implements INmosMediator {

    private node: Node;
    private coreRouter: CoreRouter;
    private appService: IAppService;

    private discoveryService: DiscoveryService;

    constructor(private port: number, nodeConfig: INodeConfig) {
        this.appService = new AppService();

        const newNode = new Node(this.appService, nodeConfig);

        this.node = newNode;
        this.setupEndpoints();
    }



    public startServer() {
        if (this.coreRouter) {
            this.coreRouter.startServer();
        }
        this.discoveryService = new DiscoveryService( this );
    }

    public addDevice(config: IDeviceConfig): string {
        const newDevice = new Device(this.appService, config, this.node.getId());
        this.node.addDevice(newDevice);
        return newDevice.id;
    }

    public addSource(config: ISourceConfig, deviceId: string): string {
        const newSource = new SourceAudio(this.appService, config);

        this.node.getDeviceList()
            .find(device => device.id === deviceId)
            .addSource(newSource);

        return newSource.id;
    }

    public addSender(config: ISenderConfig, flowId: string): string {
        let flowList: IFlow[] = this.node
            .getDeviceList()
            .map(device => device.getSourceList().map(source => source.getFlow()))
            .reduce((acc, curr) => acc.concat(curr));

        let foundFlow: IFlow = flowList.find(flow => flow.id === flowId);

        if (foundFlow) {
            // create new sender
            // add flow to sender
            const newSender = new Sender(this.appService, config);
            this.node.getDevice(foundFlow.device_id).addSender(newSender);
            return newSender.id;
        }
    }

    public addReceiverAudio(config: IReceiverAudioConfig, deviceId: string): string {
        const newReceiver = new ReceiverAudio(this.appService, config);
        const foundDevice = this.node.getDevice(deviceId);

        foundDevice && foundDevice.addReceiver(newReceiver);

        return newReceiver.id;
    }


    private setupEndpoints() {
        const discoveryApiController = new DiscoveryApiController(this);
        const connectionApiController = new ConnectionApiController(this);

        this.coreRouter = new CoreRouter(
            this.port,
            connectionApiController,
            discoveryApiController
        );
    }

    getNode(): Node {
        return this.node;
    }

    // think about setting up a store to prevent calling 
    // getNode().getResource().getModel()?

}