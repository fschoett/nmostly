import { IAppService   } from "../../utils";
import { IDeviceConfig } from ".";

import { 
    DeviceResource, 
    ReceiverResource, 
    SenderResource,
    SourceResource,
    FlowResource
} from "../../schemas";

import { ResourceCore } from "../resource-core";
import { IReceiver,   } from "../receiver";
import { Sender       } from "../sender";
import { IFlow        } from "../flow";
import { ISource,     } from "../source";


export class Device extends ResourceCore {

    private _node_id: string;

    private receiverList: IReceiver[] = [];
    private senderList: Sender[] = [];
    private sourceList: ISource[] = [];

    private type: DeviceResource[ "type" ] = "urn:x-nmos:device:generic";

    constructor(
        appService: IAppService,
        config: IDeviceConfig,
        node_id: string
    ) {
        super(appService, config);
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
        this.onUpdate();
    }

    public addReceiver(newReceiver: IReceiver) {
        this.receiverList.push(newReceiver);
        this.onUpdate();
    }

    public addSource(newSource: ISource) {
        this.sourceList.push(newSource);
        this.onUpdate();
    }

    public getSender(senderId: string): Sender {
        return this.senderList
            .find(currSender => currSender.id === senderId);
    }

    public getReceiver(receiverId: string): IReceiver {
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

    public getReceiverList(): IReceiver[] {
        return this.receiverList;
    }

    public getSourceList(): ISource[] {
        return this.sourceList;
    }

    public getAllFlows(): IFlow[] {
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

            type: this.type,
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

    public getSenderModels(): SenderResource[] {
        return this.senderList.map(currSender => currSender.getModel());
    }

    public getSourceModels(): SourceResource[] {
        return this.sourceList.map(currSource => currSource.getModel());
    }

    public getFlowModels(): FlowResource[] {
        return this.sourceList.map(currSource => currSource.getFlow().getModel())
    }
}