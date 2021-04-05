import { IAppService } from "../services/i-app-service";
import { IDeviceModel, IDeviceModelConfig } from "./interfaces/i-device-model";
import { IReceiverModel } from "./interfaces/i-receiver-model";
import { ISenderModel } from "./interfaces/i-sender-model";

export class DeviceModel implements IDeviceModel {
    id: string;
    version: string;
    label: string;
    node_id: string;
    senders: string[];
    receivers: string[];

    constructor(appService: IAppService, config: IDeviceModelConfig ) {
        this.id = appService.utilsService.generateUuid();
        this.version = Date.now().toPrecision();
        this.label = config.label;
        this.node_id = config.node_id;
        this.senders = [];
        this.receivers = [];
    }


    public addSender(newSender: ISenderModel) {
        this.senders.push(newSender.id);
    }

    public addReceiver(newReceiver: IReceiverModel) {
        this.receivers.push(newReceiver.id);
    }


}