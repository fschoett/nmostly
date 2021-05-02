import {
    NodeAPIBaseResource,
    NodeResource,
    CollectionOfDevices,
    DeviceResource,
    CollectionOfReceivers,
    ReceiverResource,
    CollectionOfSenders,
    SenderResource,
    CollectionOfSources,
    SourceResource,
    CollectionOfFlows,
    FlowResource
} from "../schemas";

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