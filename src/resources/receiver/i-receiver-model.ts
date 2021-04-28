import { IResourceCoreModel } from "../resource-core";

export interface IReceiverModel extends IResourceCoreModel {
    device_id: string;
    transport: string;
    interface_bindings: string [];
    subscription: {
        sender_id : string;
        active: boolean;
    }
}