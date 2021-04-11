import express from "express";

import { IMdnsClientService } from "../services/i-mdns-client-service";
import { IAppService } from "../services/i-app-service";
import { AppService } from "../services/app-service";

import { Node, INodeConfig } from "../models/node";
import { Device, IDeviceConfig } from "../models/device";

import { Receiver, IReceiverConfig, IReceiverAudioConfig, ReceiverAudio } from "../models/receiver";

import { ISourceConfig, ISourceModel, Source } from "../models/source";
import { ISenderConfig, Sender } from "../models/sender";
import { Flow, IFlowModel } from "../models/flow";

import { NodeApiEndpoint } from "../endpoints/node-api-endpoints";

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
            description: "Node",
            hostname: "Hostname",
            href: "HREF",
            label: "NodeName",
            tags: {}
        }

        this.self = new Node(this.appService, nodeConfig);
        this.mdnsClient = this.appService.mdnsService;
    }

    public get node(){ return this.self }

    public async start(): Promise<boolean> {
        const registeredNode = await this.mdnsClient.registerNode();
        // Start express server!

        const nodeApiEndpoint = new NodeApiEndpoint( this, 5432 );
        nodeApiEndpoint.start();

        return true;
    }


    // PUBLIC API
    public addDevice(config: IDeviceConfig): string {
        let newDevice = new Device(this.appService, config, this.self.getId());
        this.self.addDevice(newDevice);
        return newDevice.id;
    }

    public addSource(sourceConfig: ISourceConfig, deviceId: string): string {
        const newSource = new Source(this.appService, sourceConfig);

        this.self.getDeviceList()
            .find(device => device.id === deviceId)
            .addSource(newSource);

        return newSource.id;
    }

    public addSender(config: ISenderConfig, flowId: string): string {
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

    public addReceiverAudio(config: IReceiverAudioConfig, deivce_id: string) {
        const newReceiver = new ReceiverAudio(this.appService, config);
        const foundDevice = this.self.getDevice(deivce_id)
        if (foundDevice) {
            foundDevice.addReceiver(newReceiver);
        }
    }

    public getNodeRoot() {
        return ["self/", "sources/", "flows/", "devices/", "senders/", "receivers/"];
    }

    public getSelf() {
        return this.self;
    }

}