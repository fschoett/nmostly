import { AudioSourceResource } from "../../schemas";
import { IAppService } from "../../utils/interfaces/i-app-service";
import { Source, ISourceConfig } from ".";

export class SourceAudio extends Source {

    private format: AudioSourceResource["format"] = "urn:x-nmos:format:audio";
    private channels: AudioSourceResource[ "channels"];

    constructor( appService: IAppService, config: ISourceConfig ){
        super( appService, config );
        this.channels = [{
            label: "First Channel Of Audio Sender"
        }];
    }

    public getModel(): AudioSourceResource{
        return{
            ...super.getBaseSourceModel(),

            format: this.format,
            channels: this.channels
        }
    }
    
}