import { Source } from ".";
import { AudioSourceResource, Component } from "../../schemas/is-04-discovery-api/source";
import { IAppService } from "../../services/i-app-service";
import { ISourceConfig } from "./i-source-config";


export class SourceAudio extends Source {

    private format: AudioSourceResource["format"] = "urn:x-nmos:format:audio";
    private channels: AudioSourceResource[ "channels"];

    constructor( appService: IAppService, config: ISourceConfig ){
        super( appService, config );
    }

    public getModel(): AudioSourceResource{
        return{
            ...super.getBaseSourceModel(),

            format: this.format,
            channels: this.channels
        }
    }
    
}