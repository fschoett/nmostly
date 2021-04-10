import { AppService } from "../../services/app-service";
import { ResourceCore } from "../resource-config";
import { IReceiverConfig } from "./i-receiver-config";
import { IReceiverModel } from "./i-receiver-model";

export class Receiver extends ResourceCore{

    private _format: string;
    private _caps: string[];
    private _tags: string[];
    private _device_id: string;
    private _transport: string;
    private _subscription: string;


    constructor( appService: AppService, config: IReceiverConfig ){
        super( appService, config );
        this._format = config.format;
        this._caps = [];
        this._tags = [];
        this._device_id = config.deviceId;
    }


    public getModel() : IReceiverModel {
        return {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            format: this._format,
            caps: this._caps,
            tags: this._tags,
            device_id: this._device_id,
            transport: this._transport,
            subscription: this._subscription
        };
    }

}