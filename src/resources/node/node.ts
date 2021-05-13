import { INodeConfig } from ".";

import {
    NodeResource,
    CollectionOfDevices,
    CollectionOfReceivers,
     CollectionOfSenders,
    CollectionOfSources,
    CollectionOfFlows
} from "../../schemas/is-04-discovery-api";

import { ResourceCore } from "../resource-core";
import { Device } from "../device";
import { IFlow } from "../flow/i-flow";
import { IReceiver } from "../receiver/i-receiver";
import { Sender } from "../sender";
import { ISource } from "../source/i-source";
import { IAppService } from "../../utils";



export class Node extends ResourceCore {

    private caps: NodeResource["caps"] = {};
    private deviceList: Device[] = [];

    private href: string;
    private hostname: string;

    private services: NodeResource["services"];
    private api: NodeResource["api"];
    private clocks: NodeResource["clocks"] = [];
    private interfaces: NodeResource["interfaces"] = [];


    constructor(appService: IAppService, config: INodeConfig) {
        super(appService, config);

        this.href = config.href;
        this.hostname = config.hostname || "nmosty-defaulthost.local";

        this.services = config.services || [];
        this.api = config.api || {
            versions: ["v1.3"],
            endpoints: [
                {
                    host: "127.0.0.1",
                    port: 5500,
                    protocol: "http"
                }
            ]
        };
        this.clocks = config.clocks || [{ name: "clk0", ref_type: "internal"}];

        this.interfaces = this.cleanupInterfaceConfig(config.interfaces);
    }

    // Make sure that all mac addresses are lowercase aacording to nmos spec
    cleanupInterfaceConfig(interfaceList: NodeResource["interfaces"]) {
        if (interfaceList) {
            return interfaceList.map((currInterface) => {
                currInterface.chassis_id = currInterface.chassis_id.toLowerCase();
                currInterface.port_id = currInterface.port_id.toLowerCase();
                return currInterface;
            });
        }
        else{
            return [];
        }
    }

    addDevice(newDevice: Device) {
        this.deviceList.push(newDevice);
    }

    removeDevice(deviceId: string): Device {
        let foundIndex = this.deviceList
            .findIndex(currDevice => currDevice.id === deviceId);

        if (foundIndex === -1) return;

        let removedDevice = this.deviceList.splice(foundIndex, 1);
        return removedDevice[0];
    }

    public getId() { return this.id }

    public getDeviceList(): Device[] {
        return this.deviceList;
    }

    public getDevice(deviceId: string): Device {
        return this.deviceList.find(currDevice => currDevice.id === deviceId);
    }

    public getAllDeviceModels(): CollectionOfDevices {
        return this
            .deviceList
            .map(currDevice => currDevice.getModel()) as CollectionOfDevices;
    }


    // receivers
    public getReceiver(receiverId: string): IReceiver {
        const receiverList: IReceiver[] = this.deviceList
            .map(device => device.getReceiverList())
            .reduce((acc, curr) => acc.concat(curr));

        return receiverList
            .find(sender => sender.id === receiverId);
    }

    public getAllReceivers(): IReceiver[] {
        return this.deviceList
            .map(device => device.getReceiverList())
            .reduce((acc, curr) => acc.concat(curr));
    }

    public getAllReceiverModels(): CollectionOfReceivers {
        return this.getAllReceivers()
            .map(currReceiver => currReceiver.getModel()) as CollectionOfReceivers;
    }

    public getAllReceiverIds(): string[] {
        return this.getAllReceivers().map(currReceiver => currReceiver.id);
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

    public getAllSenderModels(): CollectionOfSenders {
        return this.getAllSenders()
            .map(currSender => currSender.getModel()) as CollectionOfSenders;
    }

    public getAllSenderIds(): string[] {
        return this.getAllSenders().map(currSender => currSender.id);
    }

    // flows
    public getFlow(flowId: string): IFlow {
        return this.getAllFlows()
            .find(currFlow => currFlow.id === flowId);
    }

    public getAllFlows(): IFlow[] {
        return this.deviceList
            .map(device => device.getAllFlows())
            .reduce((acc, curr) => acc.concat(curr));
    }

    public getAllFlowModels(): CollectionOfFlows {
        return this.getAllFlows()
            .map(currFlow => currFlow.getModel()) as CollectionOfFlows
    }

    // sources
    public getSource(sourceId: string) {
        let foundSource: ISource;
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

    public getAllSources(): ISource[] {
        return this.deviceList
            .map(currDevice => currDevice.getSourceList())
            .reduce((acc, curr) => acc.concat(curr));
    }

    public getAllSourceModels(): CollectionOfSources {
        return this
            .getAllSources()
            .map(currSource => currSource.getModel()) as CollectionOfSources
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