import { SenderResource } from "../../schemas";
import { IResourceCoreConfig } from "../resource-core";

export interface ISenderConfig extends IResourceCoreConfig{
    flow_id: string;
    device_id: string;
    onUpdateCallback( updatedSender: SenderResource ): void;
}