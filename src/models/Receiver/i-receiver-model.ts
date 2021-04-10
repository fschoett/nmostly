import { IResourceCoreModel } from "../resource-config";

export interface IReceiverModel extends IResourceCoreModel {
    format: string;
    caps: string[];
    tags: string[];
    device_id: string;
    transport: string;
    subscription: string;
}