import { INmosMediator } from "../api";
import { NodeAPIBaseResource, NodeResource, CollectionOfDevices, DeviceResource, CollectionOfReceivers, ReceiverResource, CollectionOfSenders, SenderResource, CollectionOfSources, SourceResource, CollectionOfFlows, FlowResource } from "../schemas";
import { IDiscoveryApiController } from "./i-discovery-api-controller";

export class DiscoveryApiController implements IDiscoveryApiController {

    private nmosMediator: INmosMediator;

    constructor( nmosMediator: INmosMediator ){
        this.nmosMediator = nmosMediator;
    }

    onGetRoot(): NodeAPIBaseResource {
        throw new Error("Method not implemented.");
    }
    onGetSelf(): NodeResource {
        throw new Error("Method not implemented.");
    }
    onGetDeviceList(): CollectionOfDevices {
        throw new Error("Method not implemented.");
    }
    onGetDevice(deviceId: string): DeviceResource {
        throw new Error("Method not implemented.");
    }
    onGetReceiverList(): CollectionOfReceivers {
        throw new Error("Method not implemented.");
    }
    onGetReceiver(receiverId: string): ReceiverResource {
        throw new Error("Method not implemented.");
    }
    onGetSenderList(): CollectionOfSenders {
        throw new Error("Method not implemented.");
    }
    onGetSender(senderId: string): SenderResource {
        throw new Error("Method not implemented.");
    }
    onGetSourceList(): CollectionOfSources {
        throw new Error("Method not implemented.");
    }
    onGetSource(sourceId: string): SourceResource {
        throw new Error("Method not implemented.");
    }
    onGetFlowList(): CollectionOfFlows {
        throw new Error("Method not implemented.");
    }
    onGetFlow(flowId: string): FlowResource {
        throw new Error("Method not implemented.");
    }

}