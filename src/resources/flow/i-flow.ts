import { FlowResource, FlowResource1 } from "../../schemas";

export interface IFlow {
    id: string;
    getModel?(): FlowResource;
    getBaseFlowModel(): FlowResource1;
}