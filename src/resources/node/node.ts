import { NodeResource } from "../../schemas/is-04-discovery-api/node";
import { IAppService } from "../../services/i-app-service";
import { IDeviceModel } from "../device";
import { Device } from "../device/device";
import { Flow, IFlowModel } from "../flow";
import { IReceiverModel, Receiver } from "../receiver";
import { ResourceCore } from "../resource-core/resource-core";
import { ISenderModel, Sender } from "../sender";
import { ISourceModel, Source } from "../source";

import { INodeConfig } from "./i-node-config";
import { INodeModel } from "./i-node-model";


export class Node extends ResourceCore {

    private href: string;
    private caps;
    private services: NodeResource["services"];

    private deviceList: Device[];

    hostname: string;

    tmp : NodeResource["api"]["endpoints"] = [
        {
            port: 4000,
            protocol: "http",
            host: "1234"
        }
    ]
    api: NodeResource["api"] = {
        versions: [
            "v1.3"
        ],
        endpoints: [
            {
                host : "192.168.178.102",
                port: 5432,
                protocol: "http"
            }
        ]
    };
    clocks: NodeResource["clocks"] = [
        {
            name: "clk0",
            ref_type: "internal"
        }
    ];
    interfaces = [
        {
            chassis_id: "null",
            name: "eth0",
            port_id: "c8-08-e9-d1-ae-31"
        }
    ];

    constructor(appService: IAppService, config: INodeConfig) {
        super(appService, config);

        // this.href = config.href;
        this.href = "http://localhost:80/"
        this.caps = {};
        this.services = [];
        this.deviceList = [];
        this.hostname = "nmos-virtnode.local";
    }

    addDevice(newDevice: Device) {
        this.deviceList.push(newDevice);
    }

    removeDevice(deviceId: string) {
        let foundIndex = this.deviceList
            .findIndex(currDevice => currDevice.id === deviceId);

        if (foundIndex === -1) return false;

        let removedDevice = this.deviceList.splice(foundIndex, 1);
        return removedDevice;
    }

    public getId() { return this.id }

    public getDeviceList(): Device[] {
        return this.deviceList;
    }

    public getDevice(deviceId: string): Device {
        return this.deviceList.find(currDevice => currDevice.id === deviceId);
    }

    public getAllDeviceModels(): IDeviceModel[] {
        return this.deviceList.map(currDevice => currDevice.getModel());
    }

    // receivers
    public getReceiver(receiverId: string): Receiver {
        const receiverList: Receiver[] = this.deviceList
            .map(device => device.getReceiverList())
            .reduce((acc, curr) => acc.concat(curr));

        return receiverList
            .find(sender => sender.id === receiverId);
    }

    public getAllReceivers(): Receiver[] {
        return this.deviceList
            .map(device => device.getReceiverList())
            .reduce((acc, curr) => acc.concat(curr));
    }

    public getAllReceiverModels(): IReceiverModel[] {
        return this.getAllReceivers()
            .map(currReceiver => currReceiver.getModel());
    }

    public getAllReceiverIds(): string[] {
        return this.getAllReceivers().map(  currReceiver => currReceiver .id );
    }


    // senders
    public getSender(senderId: string): Sender {
        return this.getAllSenders()
            .find(sender => sender.id === senderId);
    }

    public getAllSenders(): Sender[] {
        return this.deviceList
            .map(device => device.getSenderList())
            .reduce((acc, curr) => acc.concat(curr));
    }

    public getAllSenderModels(): ISenderModel[] {
        return this.getAllSenders().map(currSender => currSender.getModel());
    }

    public getAllSenderIds(): string[] {
        return this.getAllSenders().map( currSender => currSender.id );
    }

    // flows
    public getFlow(flowId: string): Flow {
        return this.getAllFlows()
            .find( currFlow => currFlow.id === flowId );
    }

    public getAllFlows(): Flow[] {
        return this.deviceList
            .map(device => device.getAllFlows())
            .reduce((acc, curr) => acc.concat(curr));
    }

    public getAllFlowModels(): IFlowModel[]{
        return this.getAllFlows()
            .map( currFlow => currFlow.getModel() );
    }

    // sources
    public getSource(sourceId: string) {
        let foundSource: Source;
        let deviceList = this.deviceList;
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

    public getAllSources(): Source[] {
        return this.deviceList
            .map(currDevice => currDevice.getSourceList())
            .reduce((acc, curr) => acc.concat(curr));
    }

    public getAllSourceModels(): ISourceModel[] {
        return this.getAllSources().map(currSource => currSource.getModel());
    }

    getModel(): NodeResource {
        const tmpModel: NodeResource = {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            tags: this.tags,
            href: this.href,
            caps: this.caps,
            api: this.api,
            services: this.services,
            clocks: this.clocks,
            interfaces: this.interfaces,
            hostname: this.hostname
        }
        return tmpModel;
    }

}