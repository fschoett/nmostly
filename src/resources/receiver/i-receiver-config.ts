import { IReceiver } from ".";
import { TransportType } from "../../schemas";
import { IResourceCoreConfig } from "../resource-core";

export interface IReceiverConfig extends IResourceCoreConfig{
    device_id: string;
    transport?: TransportType;
}

export interface IReceiverAudioConfig extends IReceiverConfig{

}