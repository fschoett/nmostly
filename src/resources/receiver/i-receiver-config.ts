import { IReceiver } from ".";
import { TransportType } from "../../schemas";
import { IResourceCoreConfig } from "../resource-core";

export interface IReceiverConfig extends IResourceCoreConfig{
    device_id: string;
    transport?: TransportType;
    subscription?: { sender_id: string, active: boolean };
}

export interface IReceiverAudioConfig extends IReceiverConfig{

}