import { IReceiverAudioConfig } from "../resources/receiver";
import { IResourceCoreConfig } from "../resources/resource-core";

export interface IAddReceiverAudioConfig extends IResourceCoreConfig{
    device_id? : string;
    receiverConfig?: IReceiverAudioConfig;
}

export interface IAddSourceAudioConfig extends IResourceCoreConfig{
    device_id? :string;
    parents?: string[];
    clock_name?: string;
}

export interface IAddSenderConfig extends IResourceCoreConfig {
    flow_id: string;
    device_id? : string;
    onActivationCallback? ( senderId :string): void;
}