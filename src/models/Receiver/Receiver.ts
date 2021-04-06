import { AppService } from "../../services/app-service";
import { ReceiverConfig } from "./receiver-config";
import { ReceiverModel } from "./receiver-model";

export class Receiver{

    private _id: string;
    private _version: string;
    private _label: string;
    private _description: string;
    private _format: string;
    private _caps: string[];
    private _tags: string[];
    private _device_id: string;
    private _transport: string;
    private _subscription: string;


    constructor( private appService: AppService, private config: ReceiverConfig ){
        this._id = appService.utilsService.generateUuid();
        this._version = appService.utilsService.generateVersion();
        this._label = config.label;
        this._description = config.description;
        this._format = config.format;
        this._caps = [];
        this._tags = [];
        this._device_id = config.deviceId;
    }

    public get id(){ return this._id }

    public getModel() : ReceiverModel {
        return {
            id: this._id,
            version: this._version,
            label: this._label,
            description: this._description,
            format: this._format,
            caps: this._caps,
            tags: this._tags,
            device_id: this._device_id,
            transport: this._transport,
            subscription: this._subscription
        };
    }

}