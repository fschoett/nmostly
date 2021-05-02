import { IAppService } from "../../services/i-app-service";
import { IFlowConfig } from "./i-flow-config";
import { ResourceCore } from "../resource-core";
import { FlowResource1 } from "../../schemas/is-04-discovery-api/flow";
import { IFlow } from "./i-flow";

export class Flow extends ResourceCore implements IFlow{

    device_id: string;
    source_id: string;
    parents: string[] = [];

    constructor( appService: IAppService, config: IFlowConfig){
        super( appService, config );

        this.device_id = config.device_id;
        this.source_id = config.source_id;
    }

    public getBaseFlowModel(): FlowResource1{
        return {
            ...this.getBaseResource(),
            source_id: this.source_id,
            device_id: this.device_id,
            parents: this.parents
        }
    }

}