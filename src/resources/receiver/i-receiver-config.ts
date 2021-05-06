import { IReceiver } from ".";
import { TransportType } from "../../schemas";
import { IResourceCoreConfig } from "../resource-core";

export interface IReceiverConfig extends IResourceCoreConfig{
    device_id: string;
    transport?: TransportType;
    onUpdateCallback?( receiverInstance: IReceiver ):void;
}

export interface IReceiverAudioConfig extends IReceiverConfig{

}