// service imports
import { IAppService } from "../../services/i-app-service";
import { FormatEnum  } from "../../enums/format-enums";

// other models import
import { Receiver, IReceiverModel } from "../receiver";
import { Sender,   SenderModel   } from "../sender";
import { Source,   SourceModel   } from "../source";
import { IFlowModel } from "../flow";

// same dir level imports
import { ResourceCore } from "../resource-config";
import { IDeviceConfig } from "./i-device-config";
import { IDeviceModel } from "./i-device-model";



export class Device extends ResourceCore{

    private _node_id: string;

    private receiverList: Receiver[] = [];
    private senderList: Sender[] = [];
    private sourceList: Source[] = [];

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

    public getSource(sourceId: string): Source {
        return this.sourceList
            .find(currSource => currSource.id === sourceId);
    }

    public getSenderList(): Sender[] {
        return this.senderList;
    }

    public getReceiverList(): Receiver[] {
        return this.receiverList;
    }

    public getSourceList(): Source[] {
        return this.sourceList;
    }

    public getModel(): IDeviceModel {
        let deviceModel: IDeviceModel = {
            id: this.id,
            version: this.version,
            type: "urn:x-nmos:device:generic",
            controls: [],
            description: this.description,
            node_id: this.node_id,
            tags: this.tags,
            label: this.label,
            senders: this.senders,
            receivers: this.receivers
        }
        return deviceModel;
    }

    public getReceiverModels(): IReceiverModel[] {
        return this.receiverList.map(currReceiver => currReceiver.getModel());
    }

    public getSenderModels(): SenderModel[] {
        return this.senderList.map(currSender => currSender.getModel());
    }

    public getSourceModels(): SourceModel[] {
        return this.sourceList.map(currSource => currSource.getModel());
    }

    public getFlowModels(): IFlowModel[] {
        return this.sourceList.map(currSource => currSource.flow.getModel())
    }
}