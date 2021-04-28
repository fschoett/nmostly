import { ISourceModel } from "../i-source-model";
import { IAudioChannel } from "./audio-channel/i-audio-channel";

export interface ISourceAudioModel extends ISourceModel{
    channels: IAudioChannel[]
}