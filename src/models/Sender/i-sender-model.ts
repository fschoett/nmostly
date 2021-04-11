import { IResourceCoreConfig, IResourceCoreModel } from "../resource-core";

export interface ISenderModel extends IResourceCoreModel{
    flow_id: string;
    transport: string;
    device_id: string;
    manifest_href: string;
    interface_bindings: string[];
    subscriptions: {
        receiver_id: string;
        active: boolean;
    };
}