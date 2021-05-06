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
    onPostBulkSenders(senders: BulkSenderResource): BulkActivationResponse;
    onPostBulkReceivers(receivers: BulkReceiverResource): BulkActivationResponse;

    onGetSenders(): ConnectionAPISenderReceiverBaseResource;
    onGetSenderConstraints(senderId: string): Constraints;
    onGetSenderStaged(senderId: string): StagedSenderResource;
    onPatchSenderStaged(senderId: string, stagedSender: StagedSenderResource): SenderResource;
    onGetSenderActive(senderId: string): StagedSenderResource;
    onGetSenderTransportFile(senderId: string): TransportFile;
    onGetSenderTransportType(senderId: string): TransportType;

    onGetReceivers(): ConnectionAPISenderReceiverBaseResource;
    onGetReceiverConstraints(receiverId: string): Constraints;
    onGetReceiverStaged(receiverId: string): StagedReceiverResource;
    onPatchReceiverStaged(receiverId: string, updatedReceiver: StagedReceiverResource): ReceiverResource;
    onGetReceiverActive(receiverId: string): StagedReceiverResource;
    onGetReceiverTransporttype(receiverId: string): TransportType;
}