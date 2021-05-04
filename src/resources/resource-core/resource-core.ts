import { BaseResource } from "../../schemas";
import { IAppService } from "../../services/interfaces";

import { IResourceCoreConfig } from ".";

export class ResourceCore{
    id: string;
    version: string;
    label: string;
    description: string;
    tags: BaseResource["tags"];

    appService: IAppService;

    constructor( appService: IAppService , config: IResourceCoreConfig){
        this.appService = appService;
        this.id = this.appService.utilsService.generateUuid();
        this.version = this.appService.utilsService.generateVersion();
        this.label = config.label;
        this.description = config.description;
        this.tags = config.tags;
    }

    public getBaseResource(): BaseResource {

        const resourceModel:BaseResource = {
            description: this.description,
            id: this.id,
            version: this.version,
            label: this.label,
            tags: this.tags
        }
        return resourceModel;
    }

}