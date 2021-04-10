import { IAppService } from "../../services/i-app-service";
import { IResourceCoreConfig } from "./i-resource-core-config";

export class ResourceCore{
    id: string;
    version: string;
    label: string;
    description: string;
    tags: object;

    appService: IAppService;

    constructor( appService: IAppService , config: IResourceCoreConfig){
        this.appService = appService;
        this.id = this.appService.utilsService.generateUuid();
        this.version = this.appService.utilsService.generateVersion();
        this.label = config.label;
        this.description = config.description;
        this.tags = config.tags;
    }

}