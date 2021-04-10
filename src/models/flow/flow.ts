import { IAppService } from "../../services/i-app-service";
import { FormatEnum } from "../../enums/format-enums";
import { IFlowConfig } from "./i-flow-config";
import { IFlowModel } from "./i-flow-model";
import { ResourceCore } from "../resource-core";

export class Flow extends ResourceCore{

    device_id: string;
    format: string;
    source_id: string;
    parents: string[];

    constructor( appService: IAppService, config: IFlowConfig){
        super( appService, config );
        this.format = "urn:x-nmos:format:data";
        this.device_id = config.device_id;
        this.tags = config.tags || {}
        this.source_id = config.source_id;
        this.parents = [];
    }

    public getModel(): IFlowModel{
        return {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            parents : this.parents,
            source_id: this.source_id,
            device_id: this.device_id,
            media_type: "application/json",
            format: this.format,
            tags: this.tags
        };
    }

}