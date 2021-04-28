import { IReceiverModel } from "../i-receiver-model";

export interface IReceiverAudioModel extends IReceiverModel {
    caps: object;
    format: string;
}