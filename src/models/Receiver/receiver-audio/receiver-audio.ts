import { IAppService } from "../../../services/i-app-service";
import { IReceiverConfig } from "../i-receiver-config";
import { Receiver } from "../receiver";
import { IReceiverAudioModel } from "./i-receiver-audio-model";


export class ReceiverAudio extends Receiver{

    format: string;
    caps: object;

    constructor( appService: IAppService, config: IReceiverConfig){
        super( appService, config );
        this.format = "urn:x-nmos:format:audio";
        this.transport = "urn:x-nmos:transport:rtp.mcast";
        this.subscription = {
            sender_id: null,
            active: false
        };
        this.caps = {};
    }


    public getModel(): IReceiverAudioModel{
        const receiverAudioModel: IReceiverAudioModel = {
            id: this.id,
            version: this.version,
            description: this.description,
            tags: this.tags,
            label: this.label,
            device_id: this.device_id,
            interface_bindings: this.interface_bindings,
            subscription: this.subscription,
            transport: this.transport,
            format: this.format,
            caps: this.caps,
        }
        return receiverAudioModel;
    }
}