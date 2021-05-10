import { INmosMediator } from "../api";
import { BulkSenderResource, BulkActivationResponse, BulkReceiverResource, ConnectionAPISenderReceiverBaseResource, Constraints, SenderResource, TransportFile, TransportType, ReceiverResource, StagedSenderResource, StagedReceiverResource } from "../schemas";
import { IConnectionApiController } from "./i-connection-api-controller";


export class ConnectionApiController implements IConnectionApiController {

    private nmosMediator: INmosMediator;

    constructor(nmosMediator: INmosMediator) {
        this.nmosMediator = nmosMediator;
    }

    onPostBulkSenders(senders: BulkSenderResource): BulkActivationResponse {
        let response: BulkActivationResponse = [];

        if (!senders) {
            response.push({
                code: 400,
                id: "errorounous!"
            });
            return response;
        }

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
        let response: BulkActivationResponse = [];


        if (!receivers) {
            response.push({
                code: 400,
                id: "errorounous!"
            });
            return response;
        }

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
        const senderModels = this.nmosMediator
            .getNode()
            .getAllSenderModels()

        if (senderModels.length > 0)
            return senderModels.map(senderModel => senderModel.id + "/");
    }

    onGetSenderConstraints(senderId: string): Constraints {
        const currSender = this.nmosMediator
            .getNode()
            .getSender(senderId);

        if (currSender) return currSender.getConstraints();
    }

    onGetSenderStaged(senderId: string): StagedSenderResource {
        const currSender = this.nmosMediator
            .getNode()
            .getSender(senderId);

        if (currSender) return currSender.getStaged();
    }

    // Find the sender according to the senderId and stage the "changed"
    onPatchSenderStaged(senderId: string, updatedSender: StagedSenderResource): StagedSenderResource {
        const currSender = this.nmosMediator
            .getNode()
            .getSender(senderId);

        if (currSender) {
            return currSender.stage(updatedSender);
        }
    }

    // What exactly should this path do??
    onGetSenderActive(senderId: string): StagedSenderResource {
        // all auto flags should be resolved to the actual values.. how to?
        const currSender = this.nmosMediator
            .getNode()
            .getSender(senderId);

        if (currSender) return currSender.getActive();
    }

    // Returns the transport file if one has been found, elsewise return zero!
    onGetSenderTransportFile(senderId: string): TransportFile {
        const currSender = this.nmosMediator
            .getNode()
            .getSender(senderId);

        if (currSender) return currSender.getTransportFile();
    }

    onGetSenderTransportType(senderId: string): TransportType {
        const currSender = this.nmosMediator
            .getNode()
            .getSender(senderId);

        if (currSender) return currSender.getTransportType();
    }

    // Return a list of all available receiver ids
    onGetReceivers(): ConnectionAPISenderReceiverBaseResource {
        const currReceiverModels = this.nmosMediator
            .getNode()
            .getAllReceiverModels()

        if (currReceiverModels.length > 0)
            return currReceiverModels.map(receiverModel => receiverModel.id + "/");
    }

    onGetReceiverConstraints(receiverId: string): Constraints {
        const currReceiver = this.nmosMediator
            .getNode()
            .getReceiver(receiverId)

        if (currReceiver) return currReceiver.getConstraints();
    }

    onGetReceiverStaged(receiverId: string): StagedReceiverResource {
        const currReceiver = this.nmosMediator
            .getNode()
            .getReceiver(receiverId);

        if (currReceiver) return currReceiver.getStaged();
    }

    onPatchReceiverStaged(receiverId: string, updatedReceiver: StagedReceiverResource):  StagedReceiverResource{
        const currReceiver = this.nmosMediator
            .getNode()
            .getReceiver(receiverId);

        if (currReceiver) {
            return currReceiver.stage(updatedReceiver);
        }
    }

    onGetReceiverActive(receiverId: string): StagedReceiverResource {
        const currReceiver = this.nmosMediator
            .getNode()
            .getReceiver(receiverId);

        if (currReceiver) return currReceiver.getActive();
    }

    onGetReceiverTransporttype(receiverId: string): TransportType {
        const currReceiver = this.nmosMediator
            .getNode()
            .getReceiver(receiverId)

        if (currReceiver) return currReceiver.getTransportType();
    }
}