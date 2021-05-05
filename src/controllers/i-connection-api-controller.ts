import {
    BulkSenderResource,
    BulkActivationResponse,
    BulkReceiverResource,
    ConnectionAPISenderReceiverBaseResource,
    Constraints,
    TransportType,
    TransportFile,
    ReceiverResource,
    SenderResource,
    StagedSenderResource,
    StagedReceiverResource
} from "../schemas";

export interface IConnectionApiController {
    onPostBulkSenders(senders: BulkSenderResource): BulkActivationResponse[];
    onPostBulkReceivers(receivers: BulkReceiverResource): BulkActivationResponse[];

    onGetSenders(): ConnectionAPISenderReceiverBaseResource;
    onGetSenderConstraints(senderId: string): Constraints;
    onGetSenderStaged(senderId: string): SenderResource;
    onPatchSenderStaged(senderId: string, updatedSender: StagedSenderResource): SenderResource;
    onGetSenderActive(senderId: string): SenderResource;
    onGetSenderTransportfile(senderId: string): TransportFile;
    onGetSenderTransporttype(senderId: string): TransportType;

    onGetReceivers(): ConnectionAPISenderReceiverBaseResource;
    onGetReceiverConstraints(receiverId: string): Constraints;
    onGetReceiverStaged(receiverId: string): ReceiverResource;
    onPatchReceiverStaged(receiverId: string, updatedReceiver: StagedReceiverResource): ReceiverResource;
    onGetReceiverActive(receiverId: string): ReceiverResource;
    onGetReceiverTransporttype(receiverId: string): TransportType;
}