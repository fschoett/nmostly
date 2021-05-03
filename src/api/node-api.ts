import express from "express";

import { IMdnsClientService } from "../services/i-mdns-client-service";
import { IAppService } from "../services/i-app-service";
import { AppService } from "../services/app-service";

import { Node, INodeConfig } from "../resources/node";
import { Device, IDeviceConfig } from "../resources/device";
import { BaseApiController } from "../endpoints/nmos-base-router";
import { Flow, IFlow } from "../resources/flow";
import { IReceiverAudioConfig, IReceiverConfig, Receiver, ReceiverAudio } from "../resources/receiver";
import { ISenderConfig, Sender } from "../resources/sender";
import { ISourceConfig, Source } from "../resources/source";


export interface INodeApiConfig {
    description: string;
    hostname: string;
    href: string;
    label: string;
    tags: {};
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
            description: config.description,
            hostname: config.hostname,
            href: config.href,
            label: config.label,
            tags: {}
        }

        this.self = new Node(this.appService, nodeConfig);
        this.mdnsClient = this.appService.mdnsService;
    }

    public get node(){ return this.self }

    public async start(): Promise<boolean> {
        const registeredNode = await this.mdnsClient.registerNode();
        // Start express server!

        const nodeApiEndpoint = new BaseApiController( this, 5432 );
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
        let flowList: IFlow[] = this.self
            .getDeviceList()
            .map(device => device.getSourceList().map(source => source.getFlow() ))
            .reduce((acc, curr) => acc.concat(curr));

        let foundFlow: IFlow = flowList.find(flow => flow.id === flowId);

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

    public getSelf() {
        return this.self;
    }

}