import { FlowResource1 } from "../../schemas";
import { IAppService   } from "../../services/i-app-service";
import { ResourceCore  } from "../resource-core";
import { IFlow, IFlowConfig } from ".";

export class Flow extends ResourceCore implements IFlow {

    device_id: string;
    source_id: string;
    parents: string[] = [];

    constructor(appService: IAppService, config: IFlowConfig) {
        super(appService, config);

        this.device_id = config.device_id;
        this.source_id = config.source_id;
    }

    public getBaseFlowModel(): FlowResource1 {
        return {
            ...this.getBaseResource(),
            source_id: this.source_id,
            device_id: this.device_id,
            parents: this.parents
        }
    }

}