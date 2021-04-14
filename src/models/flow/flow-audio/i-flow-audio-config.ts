import { IFlowConfig } from "../i-flow-config";
import { FlowMediaTypeEnum } from "./flow-media-type-enum";

export interface IFlowAudioConfig extends IFlowConfig{ 
    sample_rate: {
        numerator: number,
        denominator? : number // default should be 1
    }
    media_type: FlowMediaTypeEnum,
    bit_depth: number
}