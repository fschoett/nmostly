import { IAppService } from "../services/i-app-service";
import { FormatEnum } from "./format-enums";
import { IDeviceModel, IDeviceModelConfig } from "./interfaces/i-device-model";
import { IReceiverModel } from "./interfaces/i-receiver-model";
import { ISenderModel } from "./interfaces/i-sender-model";
import { ISourceModel } from "./interfaces/i-source-model";

export class DeviceModel implements IDeviceModel {
    id: string;
    version: string;
    label: string;
    node_id: string;
    senders: string[];
    receivers: string[];
    type: FormatEnum;


    private receiverList: IReceiverModel [] = [];
    private senderList: ISenderModel[] = [];
    private sourceList: ISourceModel[] = [];


    constructor(appService: IAppService, config: IDeviceModelConfig ) {
        this.id = appService.utilsService.generateUuid();
        this.version = Date.now().toPrecision();
        this.label = config.label;
        this.node_id = config.node_id;
        this.senders = [];
        this.receivers = [];
    }


    public addSender(newSender: ISenderModel) {
        this.senderList.push( newSender );
    }

    public addReceiver(newReceiver: IReceiverModel) {
        this.receiverList.push(newReceiver);
    }

    public addSouurce( newSource : ISourceModel ){
        this.sourceList.push( newSource );
    }

    public getApiModel(): IDeviceModel{
        const receiverIdList = this.receiverList
            .map( singleReceiver => singleReceiver.id );

        const senderIdList = this.senderList
            .map( singleSender => singleSender.id );

        const clone: IDeviceModel = {
            id : this.id,
            label: this.label,
            version: this.version,
            node_id: this.node_id,
            receivers: receiverIdList,
            senders: senderIdList,
            type: this.type
        }
        return clone;
    }


}