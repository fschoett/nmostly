import { IResourceCoreConfig } from "../resource-config";

export interface IReceiverConfig extends IResourceCoreConfig{
    format: string;
    deviceId: string;
}