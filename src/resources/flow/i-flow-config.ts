import { IResourceCoreConfig } from "../resource-core";

export interface IFlowConfig extends IResourceCoreConfig{
    source_id: string;
    device_id: string;
    format? : string;
}