import { IResourceCoreConfig } from "../resource-core";

export interface ISourceConfig extends IResourceCoreConfig{
    device_id : string;
    parents: string[]
    clock_name: string;
}