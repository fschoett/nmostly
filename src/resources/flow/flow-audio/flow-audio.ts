import { IAppService } from "../../../services/i-app-service";
import { Flow } from "../Flow";
import { FlowMediaTypeEnum } from "./flow-media-type-enum";
import { IFlowAudioConfig } from "./i-flow-audio-config";
import { IFlowAudioModel } from "./i-flow-audio-model";


export class FlowAudio extends Flow {

    format: string;
    sample_rate: {
        numerator: number,
        denominator? : number // default should be 1
    };

    media_type: FlowMediaTypeEnum;
    bit_depth: number;


    constructor(appService: IAppService, config: IFlowAudioConfig){
        super( appService, config );

        this.format = "urn:x-nmos:format:audio";
        this.sample_rate = config.sample_rate;
        this.media_type = config.media_type;
        this.bit_depth = config.bit_depth;
    }


    getModel() : IFlowAudioModel {
        const flowAudioModel: IFlowAudioModel = {
            id: this.id,
            version: this.version,
            label: this.label,
            tags: this.tags,
            description: this.description,

            device_id: this.device_id,
            source_id: this.source_id,
            parents: this.parents,

            format: this.format,
            sample_rate: this.sample_rate,
            media_type: this.media_type,
            bit_depth: this.bit_depth,
        }
        return flowAudioModel;
    }

}