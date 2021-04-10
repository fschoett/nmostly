import { IResourceCoreModel } from "../resource-core";

export interface IFlowModel extends IResourceCoreModel{
    source_id: string;
    device_id: string,
    format: string,
    media_type: string,
    parents: string[];
}