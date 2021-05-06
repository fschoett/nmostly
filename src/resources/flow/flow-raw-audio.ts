import { RawAudioFlowResource } from "../../schemas";
import { IAppService } from "../../utils";

import { Flow } from "./flow";
import { IFlowConfig  } from "./i-flow-config";


export class FlowRawAudio extends Flow{

    private format:      RawAudioFlowResource["format"] = "urn:x-nmos:format:audio";
    private sample_rate: RawAudioFlowResource["sample_rate"];
    private media_type:  RawAudioFlowResource["media_type"] = "audio/L16";
    private bit_depth:   RawAudioFlowResource["bit_depth"];

    constructor( appService: IAppService, config: IFlowConfig ){
        super( appService, config );

        this.sample_rate = {
            numerator: config.sample_rate
        };

        this.bit_depth = config.bit_depth;
    }

    public getModel(): RawAudioFlowResource {
        return{
            ...super.getBaseFlowModel(),

            format: this.format,
            sample_rate: this.sample_rate,
            media_type: this.media_type,
            bit_depth: this.bit_depth
        }
    }
}