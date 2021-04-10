import { IResourceCoreModel } from "../resource-config";

export interface IDeviceModel extends IResourceCoreModel{
    node_id: string;
    senders: string[];
    receivers: string[];
    controls: object[];
    type: string;
}