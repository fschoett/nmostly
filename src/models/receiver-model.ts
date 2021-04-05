import { IAppService } from "../services/i-app-service";
import { IReceiverModel } from "./interfaces/i-receiver-model";

export class ReceiverModel implements IReceiverModel{
    id: string;
    version: string;
    label: string;
    description: string;
    format: string;
    caps: string[];
    tags: string[];
    device_id: string;
    transport: string;
    subscription: string;

    constructor( appService: IAppService, label: string, description:string, format: string, deviceId: string ) {
        this.id = appService.utilsService.generateUuid();
        this.version = appService.utilsService.generateVersion();
        this.label = label;
        this.description = description;
        this.format = format;
        this.caps = [];
        this.tags = [];
        this.device_id = deviceId;
    }

    public setTransport( transport: string ){
        this.transport = transport;
    }

    public setSubscription( subscription: string ){
        this.subscription = subscription;
    }

}