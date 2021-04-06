import { IAppService } from "../../services/i-app-service";
import { Flow } from "../flow/Flow";
import { FormatEnum } from "../../enums/format-enums";
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

        this._flow = new Flow( appService, {
            description: "First Flow",
            label: "First label",
            source_id: "ID MISSING",
        });
    }

    public get id(){ return this._id }

    public get flow(){ return this._flow; }

    public getModel() : SourceModel{
        return {
            id: this._id,
            version: this._version,
            label: this._label,
            description: this._description,
            format: this._format,
            caps: this._caps,
            tags: this._tags,
            device_id: this._device_id,
            parents: this._parents,
            clock_name: this._clock_name
        }
    }

}