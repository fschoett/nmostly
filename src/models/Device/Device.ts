// service imports
import { IAppService } from "../../services/i-app-service";

// other models import
import { Receiver } from "../receiver/receiver";
import { Sender } from "../sender/sender";
import { Source } from "../source/source";

// same dir level imports
import { DeviceConfig } from "./device-config";
import { DeviceModel } from "./device-model";

export class Device {

    private _id: string;
    private _version: string;
    private _label: string;
    private _node_id: string;

    private receiverList: Receiver[];
    private senderList: Sender[];
    private sourceList: Source[];

    constructor(
        private appService: IAppService,
        private config: DeviceConfig,
        node_id: string
    ) {
        this._id = appService.utilsService.generateUuid();
        this._version = appService.utilsService.generateVersion();
        this._label = config.label;
        this._node_id = node_id;
    }

    public get id() { return this._id }
    public get version() { return this._version }
    public get label() { return this._label }
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

    public addSource( newSource: Source ){
        this.sourceList.push( newSource );
    }

    public getSender( senderId: string ){
        return this.senderList
            .find( currSender => currSender.id === senderId );
    }

    public getReceiver( receiverId: string ){
        return this.receiverList
            .find( currReceiver => currReceiver.id === receiverId );
    }

    public getSource( sourceId: string ){
        return this.sourceList
            .find(  currSource => currSource.id === sourceId  );
    }

    public getModel() {
        let deviceModel: DeviceModel = {
            id: this.id,
            version: this.version,
            label: this.label,
            node_id: this.node_id,
            senders: this.senders,
            receivers: this.receivers
        }
        return deviceModel;
    }
}