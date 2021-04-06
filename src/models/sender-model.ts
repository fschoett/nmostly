import { IAppService } from "../services/i-app-service";
import { ISenderModel, ISenderModelConfig } from "./interfaces/i-sender-model";

export class SenderModel implements ISenderModel{
    id: string;
    version: string;
    label: string;
    description: string;
    flow_id: string;
    transport: string;
    device_id: string;
    manifest_href: string;

    constructor( appService: IAppService, config: ISenderModelConfig){ 
        this.id = appService.utilsService.generateUuid();
        this.version = appService.utilsService.generateVersion();
        this.label = config.label;
        this.description = config.label;
        this.flow_id = config.flow_id;
        this.transport = "";
        this.device_id = config.device_id;
        this.manifest_href = "";
    }

    public publishFlow( flow_id : string ){
        this.flow_id = flow_id ;
    }

    public removeFlow(){ this.flow_id = undefined }

}