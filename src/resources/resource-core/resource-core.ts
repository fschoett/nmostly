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

    private onUpdateCallback;

    constructor( appService: IAppService , config: IResourceCoreConfig){
        this.appService = appService;
        this.id = this.appService.utilsService.generateUuid();
        this.version = this.appService.utilsService.generateVersion();
        this.label = config.label;
        this.description = config.description;
        this.tags = config.tags;

        this.setOnUpdateCallback( config.onUpdateCallback );
    }

    public onUpdate(){
        this.version = this.appService.utilsService.generateVersion();
        if( this.onUpdateCallback ){
            this.onUpdateCallback( this );
        }
    }

    public setOnUpdateCallback( updateCallback ){
        if( updateCallback ){
            this.onUpdateCallback = updateCallback
        }
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