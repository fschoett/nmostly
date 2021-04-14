import { IAppService } from "../../../services/i-app-service";
import { Source } from "../source";
import { IAudioChannel } from "./audio-channel/i-audio-channel";
import { ISourceAudioConfig } from "./i-source-audio-config";
import { ISourceAudioModel } from "./i-source-audio-model";

export class SourceAudio extends Source{

    channels : IAudioChannel[]

    constructor( appService: IAppService, config : ISourceAudioConfig){
        super( appService, config );
        this.format = "urn:x-nmos:format:audio"
        this.channels = config.channels;
    }

    getModel(): ISourceAudioModel {
        const sourceAudioModel : ISourceAudioModel = {
            id: this.id,
            version: this.version,
            description: this.description,
            tags: this.tags,
            caps: this.caps,
            clock_name: this.clock_name,
            parents: this.parents,
            label: this.label,
            device_id: this.device_id,
            channels: this.channels,
            format: this.format
        }

        return sourceAudioModel;
    }

}