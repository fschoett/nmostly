import { IAppService } from "../services/i-app-service";
import { FormatEnum } from "./format-enums";
import { ISourceModel, ISourceModelConfig } from "./interfaces/i-source-model";

export class SourceModel implements ISourceModel {
    id: string;
    version: string;
    label: string;
    description: string;
    format: string;
    caps: string[];
    tags: object;
    device_id: string;
    parents: string[];
    clock_name: string;


    constructor(
        appService: IAppService,
        config: ISourceModelConfig
    ) {
        this.id = appService.utilsService.generateUuid();
        this.version = appService.utilsService.generateVersion();
        this.label = config.label;
        this.description = config.description;
        this.format = config.format || FormatEnum.data;
        this.device_id = config.device_id;
        this.parents = [];
        this.tags = {};
        this.clock_name = null;
    }

}