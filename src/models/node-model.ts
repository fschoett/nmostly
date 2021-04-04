import { IAppService } from "../services/i-app-service";
import { INodeModel } from "./i-node-model";

class NodeModel implements INodeModel{
    id: string;
    version: string;
    label: string;
    href: string;
    hostname: string;

    constructor( appService: IAppService, label, href ){
        this.id = appService.utilsService.generateUuid();
        this.hostname = appService.getHostname();
        this.version = 
        this.href = href;
        this.label = label;
    }

}


export {
    NodeModel
};