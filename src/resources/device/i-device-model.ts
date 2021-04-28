import { IResourceCoreModel } from "../resource-core";

export interface IDeviceModel extends IResourceCoreModel{
    node_id: string;
    senders: string[];
    receivers: string[];
    controls: object[];
    type: string;
}