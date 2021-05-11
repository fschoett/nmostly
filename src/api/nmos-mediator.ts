// Utils and other modules
import { IAppService, AppService } from "../utils";

import { DiscoveryApiController, ConnectionApiController } from "../controllers";
import { CoreRouter } from "../endpoints/core-router";

// Resource Imports
import { IReceiverAudioConfig, ReceiverAudio } from "../resources/receiver";
import { IDeviceConfig, Device } from "../resources/device";
import { ISenderConfig, Sender } from "../resources/sender";
import { ISource, ISourceConfig, Source, SourceAudio } from "../resources/source";
import { INodeConfig } from "../resources/node";
import { IFlow } from "../resources/flow/i-flow";
import { Node } from "../resources/node"

// Import mediator interface
import { INmosMediator } from ".";
import { DiscoveryService } from "../discovery-service";
import { ReceiverResource } from "../schemas";
import { ResourceCore } from "../resources/resource-core";
import { IAppSettings } from "./i-app-settings";
import { IAddReceiverAudioConfig, IAddSenderConfig, IAddSourceAudioConfig } from "./i-add-resource-config";



// This module contains the central business logic.
export class NmosMediator implements INmosMediator {

    private node: Node;
    private deviceId: string;
    private coreRouter: CoreRouter;
    private appService: IAppService;

    private discoveryService: DiscoveryService;

    private ip: string;
    private port: number;
    private macAddr: string;
    private hostName: string;
    private description: string;
    private href: string;
    private label: string;

    constructor(config: IAppSettings) {
        this.appService = new AppService();

        this.port = config.port || 5500;
        this.macAddr = config.macAddr;
        this.ip = config.ipv4 || "127.0.0.1";
        this.hostName = config.hostname || "nmostly-defaultnode.local";
        this.description = config.description || "";
        this.href = this.tryBuildHref(this.ip, this.port);
        this.label = config.label || "nmostly-node-default";

        const nodeConfig: INodeConfig = {
            description: this.description,
            hostname: this.hostName,
            href: this.href,
            label: this.label,
            tags: {},
            api: {
                versions: ["v1.3"],
                endpoints: [{
                    host: config.ipv4,
                    port: config.port,
                    protocol: "http"
                }]
            },
            interfaces: [{
                chassis_id: config.macAddr,
                name: config.ifaceName,
                port_id: config.macAddr
            }]
        }

        const newNode = new Node(this.appService, config.nodeConfig || nodeConfig);
        this.node = newNode;

        this.deviceId = this.addDevice();

        this.setupEndpoints();
    }


    public startServer() {
        if (this.coreRouter) {
            this.coreRouter.startServer();
        }
        this.discoveryService = new DiscoveryService(this);
    }

    public addDevice(config?: IDeviceConfig): string {
        let tmpConfig: IDeviceConfig;
        if (config) {
            tmpConfig = {
                description: config.description,
                label: config.label,
                connection_href: config.connection_href || this.buildConnectionHref(),
            };
        }
        else {
            tmpConfig = {
                connection_href: this.buildConnectionHref()
            }
        }
        const newDevice = new Device(this.appService, tmpConfig, this.node.getId());
        this.node.addDevice(newDevice);

        if (this.discoveryService) this.discoveryService.postAllResourcesToRegistry();

        return newDevice.id;
    }

    public addAudioSource( config?: IAddSourceAudioConfig ): string {
        if( !config ){ config = {} }
        let currDeviceId = config.device_id || this.deviceId;
        const sourceConfig: ISourceConfig = {
            clock_name: config.clock_name || "clk0",
            device_id: currDeviceId,
            parents: config.parents || [],
            description: config.description,
            label: config.label,
            tags: config.tags,
            onUpdateCallback: config.onUpdateCallback
        };

        const newSource = new SourceAudio(this.appService, sourceConfig);

        if (this.discoveryService) this.discoveryService.postAllResourcesToRegistry();

        this.node.getDeviceList()
            .find(device => device.id === currDeviceId )
            .addSource(newSource);

        return newSource.id;
    }

    public addSender( config: IAddSenderConfig): string {
        if( !config ){ throw new Error( "addSender is missing config object!")}

        let currDeviceId = config.device_id || this.deviceId;
        config.device_id = currDeviceId;

        let foundFlow = this.getNode().getFlow( config.flow_id );

        if (foundFlow) {
            // create new sender
            // add flow to sender
            const newSender = new Sender(this.appService, config as ISenderConfig);
            this.node.getDevice(foundFlow.device_id).addSender(newSender);

            if (this.discoveryService) this.discoveryService.postAllResourcesToRegistry();

            return newSender.id;
        }
    }

    public addReceiverAudio(config?: IAddReceiverAudioConfig): string {

        // HiJack/ enrich callback
        let parsedConfig = config || { device_id : this.deviceId};
        if( !parsedConfig.device_id ){ parsedConfig.device_id = this.deviceId }

        let tmpCallback = parsedConfig.onUpdateCallback || ( ()=>{} );
        parsedConfig.onUpdateCallback = (resource) => {
            tmpCallback();
            this.discoveryService.updateResource(resource.getModel(), "receiver");
        };
        let newConfig: IReceiverAudioConfig = { device_id: parsedConfig.device_id };
        Object.assign(newConfig, parsedConfig );

        const newReceiver = new ReceiverAudio(this.appService, newConfig);
        const foundDevice = this.node.getDevice( parsedConfig.device_id );

        if (foundDevice) foundDevice.addReceiver(newReceiver);

        if (this.discoveryService) this.discoveryService.postAllResourcesToRegistry();

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

    public getNode(): Node { return this.node; }

    public getIp(): string {
        return this.ip;
    }

    private tryBuildHref(ip, port) {
        return `http://${ip}:${port}/`
    }

    private buildConnectionHref() {
        return `http://${this.ip}:${this.port}/x-nmos/connection/v1.1/`;
    }

    // think about setting up a store to prevent calling 
    // getNode().getResource().getModel()?

}