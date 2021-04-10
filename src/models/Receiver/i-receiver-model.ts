import { IResourceCoreModel } from "../resource-core";

export interface IReceiverModel extends IResourceCoreModel {
    format: string;
    caps: string[];
    tags: string[];
    device_id: string;
    transport: string;
    subscription: string;
}