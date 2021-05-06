import { IReceiver } from ".";
import { IResourceCoreConfig } from "../resource-core";

export interface IReceiverConfig extends IResourceCoreConfig{
    device_id: string;

    onUpdateCallback?( receiverInstance: IReceiver ):void;
}

export interface IReceiverAudioConfig extends IReceiverConfig{

}