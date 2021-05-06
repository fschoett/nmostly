import { INmosMediator } from "../api";
import { BulkSenderResource, BulkActivationResponse, BulkReceiverResource, ConnectionAPISenderReceiverBaseResource, Constraints, SenderResource, TransportFile, TransportType, ReceiverResource, StagedSenderResource, StagedReceiverResource } from "../schemas";
import { IConnectionApiController } from "./i-connection-api-controller";


export class ConnectionApiController implements IConnectionApiController{

    private nmosMediator: INmosMediator;

    constructor( nmosMediator: INmosMediator ){
        this.nmosMediator = nmosMediator;
    }

    onPostBulkSenders(senders: BulkSenderResource): BulkActivationResponse[] {
        throw new Error("Method not implemented.");
    }
    onPostBulkReceivers(receivers: BulkReceiverResource): BulkActivationResponse[] {
        throw new Error("Method not implemented.");
    }
    onGetSenders(): ConnectionAPISenderReceiverBaseResource {
        throw new Error("Method not implemented.");
    }
    onGetSenderConstraints(senderId: string): Constraints {
        throw new Error("Method not implemented.");
    }
    onGetSenderStaged(senderId: string): SenderResource {
        throw new Error("Method not implemented.");
    }

    // Find the sender according to the senderId and stage the "changed"
    onPatchSenderStaged(senderId: string, updatedSender: StagedSenderResource): SenderResource {
        const currSender = this.nmosMediator
            .getNode()
            .getSender( senderId );

        currSender.stage( updatedSender );

        // Return the new model of the sender
        return currSender.getModel();
    }

    onGetSenderActive(senderId: string): SenderResource {
        throw new Error("Method not implemented.");
    }
    onGetSenderTransportfile(senderId: string): TransportFile {
        throw new Error("Method not implemented.");
    }
    onGetSenderTransporttype(senderId: string): TransportType {
        throw new Error("Method not implemented.");
    }
    onGetReceivers(): ConnectionAPISenderReceiverBaseResource {
        throw new Error("Method not implemented.");
    }
    onGetReceiverConstraints(receiverId: string): Constraints {
        throw new Error("Method not implemented.");
    }
    onGetReceiverStaged(receiverId: string): ReceiverResource {
        throw new Error("Method not implemented.");
    }
    onPatchReceiverStaged(receiverId: string, updatedReceiver: StagedReceiverResource ): ReceiverResource {
        const currReceiver = this.nmosMediator
            .getNode()
            .getReceiver( receiverId );

        currReceiver.stage( updatedReceiver );

        return currReceiver.getModel();
    }
    onGetReceiverActive(receiverId: string): ReceiverResource {
        throw new Error("Method not implemented.");
    }
    onGetReceiverTransporttype(receiverId: string): TransportType {
        throw new Error("Method not implemented.");
    }

}