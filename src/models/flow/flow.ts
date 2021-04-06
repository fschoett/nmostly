import { IAppService } from "../../services/i-app-service";
import { FormatEnum } from "../../enums/format-enums";
import { FlowConfig } from "./flow-config";
import { FlowModel } from "./flow-model";

export class Flow{

    private _id: string;
    private _version: string;
    private _device_id: string;
    private _label: string;
    private _description: string;
    private _format: string;
    private _tags: string[];
    private _source_id: string;
    private _parents: string[];

    constructor( appService: IAppService, config: FlowConfig){
        this._id = appService.utilsService.generateUuid();
        this._version = appService.utilsService.generateVersion();
        this._label = config.label;
        this._description = config.description;
        this._format = FormatEnum.deviceGeneric;
        this._tags = [];
        this._source_id = config.source_id;
        this._parents = [];
    }

    public get id(){ return this._id }
    public get device_id (){ return this._device_id}

    public getModel(): FlowModel{
        return {
            id: this.id,
            version: this._version,
            label: this._label,
            description: this._description,
            format: this._format,
            parents : this._parents,
            source_id: this._source_id,
            tags: this._tags
        };
    }

}