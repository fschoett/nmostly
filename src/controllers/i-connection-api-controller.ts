import {
    BulkSenderResource,
    BulkActivationResponse,
    BulkReceiverResource,
    ConnectionAPISenderReceiverBaseResource,
    Constraints,
    TransportType,
    TransportFile,
    StagedSenderResource,
    StagedReceiverResource
} from "../schemas";

export interface IConnectionApiController {
    onPostBulkSenders(senders: BulkSenderResource): BulkActivationResponse;
    onPostBulkReceivers(receivers: BulkReceiverResource): BulkActivationResponse;

    onGetSenders(): ConnectionAPISenderReceiverBaseResource;
    onGetSenderConstraints(senderId: string): Constraints;
    onGetSenderStaged(senderId: string): StagedSenderResource;
    onPatchSenderStaged(senderId: string, stagedSender: StagedSenderResource): StagedSenderResource;
    onGetSenderActive(senderId: string): StagedSenderResource;
    onGetSenderTransportFile(senderId: string): TransportFile;
    onGetSenderTransportType(senderId: string): TransportType;
    onGetSenderSdpHref( senderId: string): string;

    onGetReceivers(): ConnectionAPISenderReceiverBaseResource;
    onGetReceiverConstraints(receiverId: string): Constraints;
    onGetReceiverStaged(receiverId: string): StagedReceiverResource;
    onPatchReceiverStaged(receiverId: string, updatedReceiver: StagedReceiverResource): StagedReceiverResource;
    onGetReceiverActive(receiverId: string): StagedReceiverResource;
    onGetReceiverTransporttype(receiverId: string): TransportType;
}