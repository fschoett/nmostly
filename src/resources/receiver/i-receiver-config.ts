import { IReceiver } from ".";
import { Constraints, TransportType } from "../../schemas";
import { IResourceCoreConfig } from "../resource-core";
import { ReceiverAudio } from "./receiver-audio";

export interface IReceiverConfig extends IResourceCoreConfig{
    device_id: string;
    transport?: TransportType;
    subscription?: { sender_id: string, active: boolean };

    // connection api
    constraints?: Constraints;
}

export interface IReceiverAudioConfig extends IReceiverConfig{
}