import { INmosMediator } from "../api";
import { BulkSenderResource, BulkActivationResponse, BulkReceiverResource, ConnectionAPISenderReceiverBaseResource, Constraints, SenderResource, TransportFile, TransportType, ReceiverResource, StagedSenderResource, StagedReceiverResource } from "../schemas";
import { IConnectionApiController } from "./i-connection-api-controller";


export class ConnectionApiController implements IConnectionApiController {

    private nmosMediator: INmosMediator;

    constructor(nmosMediator: INmosMediator) {
        this.nmosMediator = nmosMediator;
    }

    onPostBulkSenders(senders: BulkSenderResource): BulkActivationResponse {
        let response: BulkActivationResponse;

        // find each sender in node and stage it with the current sender params
        senders.forEach(sender => {
            try {
                this.nmosMediator
                    .getNode()
                    .getSender(sender.id)
                    .stage(sender.params);

                response.push({
                    id: sender.id,
                    code: 200
                });
            }
            catch (error) {
                // In case of an error occuring during staging, return a 400 with the error description
                response.push({
                    id: sender.id,
                    code: 400,
                    error: error
                });

            }
        });

        return response;
    }

    onPostBulkReceivers(receivers: BulkReceiverResource): BulkActivationResponse {
        let response: BulkActivationResponse;

        // find each sender in node and stage it with the current sender params
        receivers.forEach(receiver => {
            try {
                this.nmosMediator
                    .getNode()
                    .getReceiver(receiver.id)
                    .stage(receiver.params);

                response.push({
                    id: receiver.id,
                    code: 200
                });
            }
            catch (error) {
                // In case of an error occuring during staging, return a 400 with the error description
                response.push({
                    id: receiver.id,
                    code: 400,
                    error: error
                });

            }
        });

        return response;
    }


    // Return a lsit of all available sender ids
    onGetSenders(): ConnectionAPISenderReceiverBaseResource {
        return this.nmosMediator
            .getNode()
            .getAllSenderModels()
            .map(senderModel => senderModel.id);
    }

    onGetSenderConstraints(senderId: string): Constraints {
        return this.nmosMediator
            .getNode()
            .getSender( senderId )
            .getConstraints()
    }

    onGetSenderStaged(senderId: string): StagedSenderResource {
        return this.nmosMediator
            .getNode()
            .getSender( senderId )
            .getStaged();
    }

    // Find the sender according to the senderId and stage the "changed"
    onPatchSenderStaged(senderId: string, updatedSender: StagedSenderResource): SenderResource {
        const currSender = this.nmosMediator
            .getNode()
            .getSender(senderId);

        currSender.stage(updatedSender);

        // Return the new model of the sender
        return currSender.getModel();
    }

    // What exactly should this path do??
    onGetSenderActive(senderId: string): StagedSenderResource{
       // all auto flags should be resolved to the actual values.. how to?
       return this.nmosMediator
        .getNode()
        .getSender( senderId )
        .getActive();
    }

    onGetSenderTransportFile(senderId: string): TransportFile {
        throw new Error("Method not implemented.");
    }

    onGetSenderTransportType(senderId: string): TransportType {
        return this.nmosMediator
            .getNode()
            .getSender( senderId )
            .getTransportType();
    }

    // Return a list of all available receiver ids
    onGetReceivers(): ConnectionAPISenderReceiverBaseResource {
        return this.nmosMediator
            .getNode()
            .getAllReceiverModels()
            .map(receiverModel => receiverModel.id);
    }

    onGetReceiverConstraints(receiverId: string): Constraints {
        return this.nmosMediator
            .getNode()
            .getReceiver( receiverId )
            .getConstraints()
    }

    onGetReceiverStaged(receiverId: string): StagedReceiverResource{
        return this.nmosMediator
            .getNode()
            .getReceiver( receiverId )
            .getStaged();
    }

    onPatchReceiverStaged(receiverId: string, updatedReceiver: StagedReceiverResource): ReceiverResource {
        const currReceiver = this.nmosMediator
            .getNode()
            .getReceiver(receiverId);

        currReceiver.stage(updatedReceiver);

        return currReceiver.getModel();
    }

    onGetReceiverActive(receiverId: string): StagedReceiverResource{
        return this.nmosMediator
            .getNode()
            .getReceiver( receiverId )
            .getActive();
    }

    onGetReceiverTransporttype(receiverId: string): TransportType {
        return this.nmosMediator
            .getNode()
            .getReceiver( receiverId )
            .getTransportType();
    }
}