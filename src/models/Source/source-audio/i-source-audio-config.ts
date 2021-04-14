import { ISourceConfig } from "../i-source-config";
import { IAudioChannel } from "./audio-channel/i-audio-channel";


export interface ISourceAudioConfig extends ISourceConfig {
    channels : IAudioChannel[]
}