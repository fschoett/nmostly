import { IResourceCoreConfig } from "../resource-core";

export interface IDeviceConfig extends IResourceCoreConfig{
    node_id?: string;
    connection_href? : string;
}