import { BulkReceiverResource } from "../schemas/is-05-connection-api/bulk-receiver-post-schema";
import { BulkActivationResponse } from "../schemas/is-05-connection-api/bulk-response-schema";
import { BulkSenderResource } from "../schemas/is-05-connection-api/bulk-sender-post-schema";
import { Constraints } from "../schemas/is-05-connection-api/constraints-schema";
import { ReceiverResource } from "../schemas/is-05-connection-api/receiver-stage-schema";
import { ConnectionAPISenderReceiverBaseResource } from "../schemas/is-05-connection-api/sender-receiver-base";
import { SenderResource as StageSenderResource } from "../schemas/is-05-connection-api/sender-stage-schema";
import { TransportType } from "../schemas/is-05-connection-api/transporttype-response-schema";

export interface IConnectionApiController{
    onPostBulkSenders( senders: BulkSenderResource ): BulkActivationResponse[];
    onPostBulkReceivers( receivers: BulkReceiverResource): BulkActivationResponse[];

    onGetSenders(): ConnectionAPISenderReceiverBaseResource;
    onGetSenderConstraints( senderId: string ): Constraints;
    onGetSenderStaged( senderId: string ): StageSenderResource;
    onPatchSenderStaged( senderId: string, updatedSender: StageSenderResource ): StageSenderResource;
    onGetSenderActive( senderId: string ): StageSenderResource;
    onGetSenderTransportfile( senderId: string ): unknown;
    onGetSenderTransporttype( senderId: string ): TransportType;

    onGetReceivers(): ConnectionAPISenderReceiverBaseResource;
    onGetReceiverConstraints( receiverId: string ): Constraints;
    onGetReceiverStaged( receiverId: string ): ReceiverResource;
    onPatchReceiverStaged( receiverId: string, updatedReceiver: ReceiverResource ): ReceiverResource;
    onGetReceiverActive( receiverId: string ): ReceiverResource;
    onGetReceiverTransporttype( receiverId: string ): TransportType;
}