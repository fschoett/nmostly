import { ReceiverResource, StagedReceiverResource } from "../../schemas";
import { ConstraintRtp } from "../constraint/constraint-rtp";
import { StageReceiver } from "../stage/stage-receiver";

export interface IReceiver{
    id: string;

    getConstraints(): ConstraintRtp;
    getStaged(): StageReceiver;

    stage( stagedReceiver: StagedReceiverResource );

    getModel?(): ReceiverResource;
}