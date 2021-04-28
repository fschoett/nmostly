import { DeviceResource } from "../schemas/is-04-discovery-api/device";
import { CollectionOfDevices } from "../schemas/is-04-discovery-api/devices";
import { FlowResource } from "../schemas/is-04-discovery-api/flow";
import { CollectionOfFlows } from "../schemas/is-04-discovery-api/flows";
import { NodeResource } from "../schemas/is-04-discovery-api/node";
import { NodeAPIBaseResource } from "../schemas/is-04-discovery-api/nodeapi-base";
import { CollectionOfReceivers } from "../schemas/is-04-discovery-api/receivers";
import { ReceiverResource } from "../schemas/is-04-discovery-api/receiver";
// import { ReceiverResource } from "../schemas/is-04-discovery-api/receiver_core";
import { SenderResource } from "../schemas/is-04-discovery-api/sender";
import { CollectionOfSenders } from "../schemas/is-04-discovery-api/senders";
import { CollectionOfSources } from "../schemas/is-04-discovery-api/sources";
import { SourceResource } from "../schemas/is-04-discovery-api/source_generic";

export interface IDiscoveryApiController{

    onGetRoot(): NodeAPIBaseResource;
    onGetSelf(): NodeResource;

    onGetDeviceList(): CollectionOfDevices;
    onGetDevice( deviceId: string ): DeviceResource;

    onGetReceiverList(): CollectionOfReceivers;
    onGetReceiver( receiverId: string ): ReceiverResource;

    onGetSenderList(): CollectionOfSenders;
    onGetSender( senderId : string ): SenderResource;

    onGetSourceList(): CollectionOfSources;
    onGetSource( sourceId : string ): SourceResource;

    onGetFlowList(): CollectionOfFlows;
    onGetFlow( flowId : string ): FlowResource;
}