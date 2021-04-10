import { IResourceCoreConfig } from "../resource-config";

export interface IDeviceConfig extends IResourceCoreConfig{
    node_id?: string;
}