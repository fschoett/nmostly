import { Constraints, SenderResource, TransportType } from "../../schemas";
import { IResourceCoreConfig } from "../resource-core";

export interface ISenderConfig extends IResourceCoreConfig{
    flow_id: string;
    device_id: string;
    transport?: TransportType;

    sdpHref?: string;
    onActivationCallback?( senderId: string ): void;

    // onUpdateCallback( updatedSender: SenderResource ): void;

    // connection api settings
    constraints?: Constraints;
}