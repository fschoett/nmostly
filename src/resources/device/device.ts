// service imports
import { IAppService } from "../../services/i-app-service";
import { FormatEnum  } from "../../enums/format-enums";

// other models import
import { Receiver } from "../receiver";
import { Sender,   ISenderModel   } from "../sender";
import { Flow, IFlowModel } from "../flow";

// same dir level imports
import { ResourceCore } from "../resource-core";
import { IDeviceConfig } from "./i-device-config";
import { DeviceResource } from "../../schemas/is-04-discovery-api/device";
import { ReceiverResource } from "../../schemas/is-04-discovery-api/receiver";
import { Source } from "../source";
import { SourceResource } from "../../schemas/is-04-discovery-api/source";
import { ISource } from "../source/i-source";
import { FlowResource } from "../../schemas/is-04-discovery-api/flow";
import { IFlow } from "../flow/i-flow";



export class Device extends ResourceCore{

    private _node_id: string;

    private receiverList: Receiver[] = [];
    private senderList: Sender[] = [];
    private sourceList: ISource[] = [];

    constructor(
        appService: IAppService,
        config: IDeviceConfig,
        node_id: string
    ) {
        super( appService, config );
        this._node_id = node_id;
    }

    
    public get node_id() { return this._node_id }

    public get senders() {
        return this.senderList.map(currSender => currSender.id);
    }
    public get receivers() {
        return this.receiverList.map(currReceiver => currReceiver.id);
    }

    public addSender(newSender: Sender) {
        this.senderList.push(newSender);
    }

    public addReceiver(newReceiver: Receiver) {
        this.receiverList.push(newReceiver);
    }

    public addSource(newSource: Source) {
        this.sourceList.push(newSource);
    }

    public getSender(senderId: string): Sender {
        return this.senderList
            .find(currSender => currSender.id === senderId);
    }

    public getReceiver(receiverId: string): Receiver {
        return this.receiverList
            .find(currReceiver => currReceiver.id === receiverId);
    }

    public getSource(sourceId: string): ISource {
        return this.sourceList
            .find(currSource => currSource.id === sourceId);
    }

    public getSenderList(): Sender[] {
        return this.senderList;
    }

    public getReceiverList(): Receiver[] {
        return this.receiverList;
    }

    public getSourceList(): ISource[] {
        return this.sourceList;
    }

    public getAllFlows(): IFlow[]{
        return this.sourceList
            .map(currSource => currSource.getFlow())
    }

    public getModel(): DeviceResource {
        let deviceModel: DeviceResource = {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            tags: this.tags,

            type: "urn:x-nmos:device:generic",
            controls: [],
            node_id: this.node_id,
            senders: this.senders,
            receivers: this.receivers
        }
        return deviceModel;
    }

    public getReceiverModels(): ReceiverResource[] {
        return this.receiverList.map(currReceiver => currReceiver.getModel());
    }

    public getSenderModels(): ISenderModel[] {
        return this.senderList.map(currSender => currSender.getModel());
    }

    public getSourceModels(): SourceResource[] {
        return this.sourceList.map(currSource => currSource.getModel());
    }

    public getFlowModels(): FlowResource[] {
        return this.sourceList.map(currSource => currSource.getFlow().getModel())
    }
}