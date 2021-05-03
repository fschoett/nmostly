import { IResourceCoreConfig } from "../resource-core";

export interface IReceiverConfig extends IResourceCoreConfig{
    device_id: string;
}

export interface IReceiverAudioConfig extends IReceiverConfig{

}