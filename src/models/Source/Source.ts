import { IAppService } from "../../services/i-app-service";
import { Flow } from "../flow/Flow";
import { FormatEnum } from "../_old/format-enums";
import { SourceConfig } from "./source-config";
import { SourceModel } from "./source-model";

export class Source{
    private _id: string;
    private _version: string;
    private _label: string;
    private _description: string;
    private _format: string;
    private _caps: string[];
    private _tags: object;
    private _device_id: string;
    private _parents: string[];
    private _clock_name: string;

    private _flow: Flow;

    constructor( private appService: IAppService, private config: SourceConfig ){
        this._id = appService.utilsService.generateUuid();
        this._version = appService.utilsService.generateVersion();
        this._label = config.label;
        this._description = config.description;
        this._format = config.format || FormatEnum.data;
        this._device_id = config.device_id;
        this._parents = [];
        this._tags = {};
        this._clock_name = null;
    }

    public get id(){ return this._id }

    public get flow(){ return this._flow; }

    public getModel() : SourceModel{
        return new SourceModel();
    }

}