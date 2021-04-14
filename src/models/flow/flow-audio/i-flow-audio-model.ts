import { IFlowModel } from "../i-flow-model";
import { FlowMediaTypeEnum } from "./flow-media-type-enum";


export interface IFlowAudioModel extends IFlowModel{
    format: string;
    sample_rate: {
        numerator: number,
        denominator? : number // default should be 1
    };

    media_type: FlowMediaTypeEnum;
    bit_depth: number
}