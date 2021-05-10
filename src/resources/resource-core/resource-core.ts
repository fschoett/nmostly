import { BaseResource } from "../../schemas";
import { IResourceCoreConfig } from ".";
import { IAppService } from "../../utils";
import { generateLabel, ResourceType } from "../../utils/label-generator";

export class ResourceCore {
    id: string;
    version: string;
    label: string;
    description: string;
    tags: BaseResource["tags"];

    resourceType: ResourceType;

    appService: IAppService;

    private onUpdateCallback;

    constructor(appService: IAppService, config: IResourceCoreConfig, resourceType?: ResourceType) {
        this.resourceType = resourceType || ResourceType.generic;

        this.appService = appService;
        this.id = this.appService.utilsService.generateUuid();
        this.version = this.appService.utilsService.generateVersion();
        this.label = config.label || this.buildDefaultLabel();
        this.description = config.description || "Default NMOSTLY description";
        this.tags = config.tags || {};


        this.setOnUpdateCallback(config.onUpdateCallback);
    }

    private buildDefaultLabel() {
        return generateLabel( this.resourceType)
    }

    public onUpdate() {
        this.version = this.appService.utilsService.generateVersion();
        if (this.onUpdateCallback) {
            this.onUpdateCallback(this);
        }
    }

    public setOnUpdateCallback(updateCallback) {
        if (updateCallback) {
            this.onUpdateCallback = updateCallback
        }
    }

    public getBaseResource(): BaseResource {

        const resourceModel: BaseResource = {
            description: this.description,
            id: this.id,
            version: this.version,
            label: this.label,
            tags: this.tags
        }
        return resourceModel;
    }

}