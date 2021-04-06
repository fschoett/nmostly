import { IAppService } from "../../services/i-app-service";
import { SenderConfig } from "./sender-config";
import { SenderModel } from "./sender-model";

export class Sender{
    private _id: string;
    private _version: string;
    private _label: string;
    private _description: string;
    private _flow_id: string;
    private _transport: string;
    private _device_id: string;
    private _manifest_href: string;

    constructor( private appService: IAppService, config: SenderConfig){
        this._id = appService.utilsService.generateUuid();
        this._version = appService.utilsService.generateVersion();
        this._label = config.label;
        this._description = config.label;
        this._flow_id = config.flow_id;
        this._transport = "";
        this._device_id = config.device_id;
        this._manifest_href = "";
    }

    public get id(){ return this._id }

    public getModel(): SenderModel {
        return {
            id: this._id,
            version: this._version,
            label: this._label,
            description: this._description,
            flow_id: this._flow_id,
            transport: this._transport,
            device_id: this._device_id,
            manifest_href: this._manifest_href
        }
    }
}