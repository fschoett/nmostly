import { ReceiverResource, StagedReceiverResource } from "../../schemas";
import { ConstraintRtp } from "../constraint/constraint-rtp";
import { StageReceiver } from "../stage/stage-receiver";

export interface IReceiver{
    id: string;

    getConstraints(): ConstraintRtp;
    getStaged(): StagedReceiverResource;

    stage( stagedReceiver: StagedReceiverResource );

    getModel?(): ReceiverResource;
}