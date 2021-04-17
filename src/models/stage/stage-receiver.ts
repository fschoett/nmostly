import { IActivation } from "../activation/i-activation";
import { ITransportParams } from "../transport-params/i-transport-params";

export class StageReceiver{
    sender_id : string | null;
    master_enable: boolean;
    activation: IActivation;
    transport_params: ITransportParams
}