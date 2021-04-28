import express from "express";

import { IMdnsClientService } from "../services/i-mdns-client-service";
import { IAppService } from "../services/i-app-service";
import { AppService } from "../services/app-service";

import { Node, INodeConfig } from "../resources/node";
import { Device, IDeviceConfig } from "../resources/device";

import { Receiver, IReceiverConfig, IReceiverAudioConfig, ReceiverAudio } from "../resources/receiver";

import { ISourceConfig, ISourceModel, Source } from "../resources/source";
import { ISenderConfig, Sender } from "../resources/sender";
import { Flow, IFlowModel } from "../resources/flow";

import { BaseApiController } from "../endpoints/base-api-router";
import { IConnectionApiController } from "../controllers/i-connection-api-controller";
import { BulkReceiverResource } from "../schemas/is-05-connection-api/bulk-receiver-post-schema";
import { BulkActivationResponse } from "../schemas/is-05-connection-api/bulk-response-schema";
import { BulkSenderResource } from "../schemas/is-05-connection-api/bulk-sender-post-schema";
import { Constraints } from "../schemas/is-05-connection-api/constraints-schema";
import { ReceiverResource as StageReceiverResource } from "../schemas/is-05-connection-api/receiver-stage-schema";
import { ConnectionAPISenderReceiverBaseResource } from "../schemas/is-05-connection-api/sender-receiver-base";
import { SenderResource as StageSenderResource } from "../schemas/is-05-connection-api/sender-stage-schema";
import { TransportType } from "../schemas/is-05-connection-api/transporttype-response-schema";
import { IDiscoveryApiController } from "../controllers/i-discovery-api-controller";
import { DeviceResource } from "../schemas/is-04-discovery-api/device";
import { CollectionOfDevices } from "../schemas/is-04-discovery-api/devices";
import { FlowResource } from "../schemas/is-04-discovery-api/flow";
import { CollectionOfFlows } from "../schemas/is-04-discovery-api/flows";
import { NodeResource } from "../schemas/is-04-discovery-api/node";
import { NodeAPIBaseResource } from "../schemas/is-04-discovery-api/nodeapi-base";
import { CollectionOfReceivers } from "../schemas/is-04-discovery-api/receivers";
import { ReceiverResource } from "../schemas/is-04-discovery-api/receiver";
import { SenderResource } from "../schemas/is-04-discovery-api/sender";
import { CollectionOfSenders } from "../schemas/is-04-discovery-api/senders";
import { CollectionOfSources } from "../schemas/is-04-discovery-api/sources";
import { SourceResource } from "../schemas/is-04-discovery-api/source_generic";

export interface INodeApiConfig {
    description: string;
    hostname: string;
    href: string;
    label: string;
    tags: {};
}


export class NodeApi implements IConnectionApiController, IDiscoveryApiController {

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
    onGetRoot(): NodeAPIBaseResource {
        throw new Error("Method not implemented.");
    }
    onGetSelf(): NodeResource {
        throw new Error("Method not implemented.");
    }
    onGetDeviceList(): CollectionOfDevices {
        throw new Error("Method not implemented.");
    }
    onGetDevice(deviceId: string): DeviceResource {
        throw new Error("Method not implemented.");
    }
    onGetReceiverList(): CollectionOfReceivers {
        throw new Error("Method not implemented.");
    }
    onGetReceiver(receiverId: string): ReceiverResource {
        throw new Error("Method not implemented.");
    }
    onGetSenderList(): CollectionOfSenders {
        throw new Error("Method not implemented.");
    }
    onGetSender(senderId: string): SenderResource {
        throw new Error("Method not implemented.");
    }
    onGetSourceList(): CollectionOfSources {
        throw new Error("Method not implemented.");
    }
    onGetSource(sourceId: string): SourceResource {
        throw new Error("Method not implemented.");
    }
    onGetFlowList(): CollectionOfFlows {
        throw new Error("Method not implemented.");
    }
    onGetFlow(flowId: string): FlowResource {
        throw new Error("Method not implemented.");
    }
    onPostBulkSenders(senders: BulkSenderResource): BulkActivationResponse[] {
        throw new Error("Method not implemented.");
    }
    onPostBulkReceivers(receivers: BulkReceiverResource): BulkActivationResponse[] {
        throw new Error("Method not implemented.");
    }
    onGetSenders(): ConnectionAPISenderReceiverBaseResource {
        throw new Error("Method not implemented.");
    }
    onGetSenderConstraints(senderId: string): Constraints {
        throw new Error("Method not implemented.");
    }
    onGetSenderStaged(senderId: string): StageSenderResource {
        throw new Error("Method not implemented.");
    }
    onPatchSenderStaged(senderId: string, updatedSender: StageSenderResource): StageSenderResource {
        throw new Error("Method not implemented.");
    }
    onGetSenderActive(senderId: string): StageSenderResource {
        throw new Error("Method not implemented.");
    }
    onGetSenderTransportfile(senderId: string): unknown {
        throw new Error("Method not implemented.");
    }
    onGetSenderTransporttype(senderId: string): TransportType {
        throw new Error("Method not implemented.");
    }
    onGetReceivers(): ConnectionAPISenderReceiverBaseResource {
        throw new Error("Method not implemented.");
    }
    onGetReceiverConstraints(receiverId: string): Constraints {
        throw new Error("Method not implemented.");
    }
    onGetReceiverStaged(receiverId: string): StageReceiverResource {
        throw new Error("Method not implemented.");
    }
    onPatchReceiverStaged(receiverId: string, updatedReceiver: StageReceiverResource): StageReceiverResource {
        throw new Error("Method not implemented.");
    }
    onGetReceiverActive(receiverId: string): StageReceiverResource {
        throw new Error("Method not implemented.");
    }
    onGetReceiverTransporttype(receiverId: string): TransportType {
        throw new Error("Method not implemented.");
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