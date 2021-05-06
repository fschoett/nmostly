import { Constraints, ReceiverResource, StagedReceiverResource, TransportType } from "../../schemas";

export interface IReceiver{
    id: string;

    getConstraints(): Constraints;
    getStaged(): StagedReceiverResource;
    getActive(): StagedReceiverResource;
    getTransportType(): TransportType;


    stage( stagedReceiver: StagedReceiverResource );

    getModel?(): ReceiverResource;
}