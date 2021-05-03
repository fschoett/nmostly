import { FlowResource, FlowResource1 } from "../../schemas";

export interface IFlow {
    id: string;
    device_id: string;

    getModel?(): FlowResource;
    getBaseFlowModel(): FlowResource1;
}