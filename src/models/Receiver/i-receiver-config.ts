import { IResourceCoreConfig } from "../resource-core";

export interface IReceiverConfig extends IResourceCoreConfig{
    format: string;
    deviceId: string;
}