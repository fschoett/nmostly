import { AudioReceiverResource } from "../../schemas";
import { IAppService } from "../../services/interfaces/i-app-service";

import { ISourceConfig } from "../source";
import { IReceiverAudioConfig, IReceiverConfig } from "./i-receiver-config";
import { Receiver } from "./receiver"

export class ReceiverAudio extends Receiver {

    format: AudioReceiverResource["format"] = "urn:x-nmos:format:audio";

    caps: AudioReceiverResource["caps"] = {
        media_types: ["audio/L16"]
    };

    constructor( appService: IAppService, config: IReceiverAudioConfig ){
        super( appService, config );
    }

    public getModel(): AudioReceiverResource{
        return{
            ...super.getBaseReceiverModel(),
            format: this.format,
            caps: this.caps
        };
    }
}