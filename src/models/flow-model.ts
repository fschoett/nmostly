import { IAppService } from "../services/i-app-service";
import { FormatEnum } from "./format-enums";
import { IFlowModel, IFlowModelConfig } from "./interfaces/i-flow-model";

export class FlowModel implements IFlowModel{
    id: string;
    version: string;
    label: string;
    description: string;
    format: string;
    tags: string[];
    source_id: string;
    parents: string[];

    constructor( appService: IAppService, config: IFlowModelConfig ){
        this.id = appService.utilsService.generateUuid();
        this.version = appService.utilsService.generateVersion();
        this.label = config.label;
        this.description = config.description;
        this.format = FormatEnum.deviceGeneric;
        this.tags = [];
        this.source_id = config.source_id;
        this.parents = [];
    }


    public getApiModel(): IFlowModel{
        const clone : IFlowModel= {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            format: this.format,
            parents : this.parents,
            source_id: this.source_id,
            tags: this.tags
        }
        return clone;
    }

}