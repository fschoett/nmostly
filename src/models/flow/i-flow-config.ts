import { IResourceCoreConfig } from "../resource-config";

export interface IFlowConfig extends IResourceCoreConfig{
    source_id: string;
    device_id: string;
    format? : string;
}