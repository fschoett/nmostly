import { FlowResource,FlowResource1  } from "../../schemas/is-04-discovery-api/flow";

export interface IFlow {
    id: string;
    getModel?(): FlowResource;
    getBaseFlowModel(): FlowResource1;
}