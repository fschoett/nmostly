import { INmosMediator } from "../api";

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

import { IDiscoveryApiController } from "./i-discovery-api-controller";



export class DiscoveryApiController implements IDiscoveryApiController {

    private nmosMediator: INmosMediator;

    constructor(nmosMediator: INmosMediator) {
        this.nmosMediator = nmosMediator;
    }

    onGetRoot(): NodeAPIBaseResource {
        return ["self/", "sources/", "flows/", "devices/", "senders/", "receivers/"];
    }

    onGetSelf(): NodeResource {
        return this.nmosMediator
            .getNode()
            .getModel();
    }

    onGetDeviceList(): CollectionOfDevices {
        return this.nmosMediator
            .getNode()
            .getAllDeviceModels();
    }

    onGetDevice(deviceId: string): DeviceResource {
        return this.nmosMediator
            .getNode()
            .getDevice(deviceId)
            .getModel();
    }

    onGetReceiverList(): CollectionOfReceivers {
        return this.nmosMediator
            .getNode()
            .getAllReceiverModels()
    }

    onGetReceiver(receiverId: string): ReceiverResource {
        return this.nmosMediator
            .getNode()
            .getReceiver(receiverId)
            .getModel();
    }

    onGetSenderList(): CollectionOfSenders {
        return this.nmosMediator
            .getNode()
            .getAllSenderModels();
    }

    onGetSender(senderId: string): SenderResource {
        return this.nmosMediator
            .getNode()
            .getSender( senderId )
            .getModel();
    }

    onGetSourceList(): CollectionOfSources {
        return this.nmosMediator
            .getNode()
            .getAllSourceModels();
    }

    onGetSource(sourceId: string): SourceResource {
        return this.nmosMediator
            .getNode()
            .getSource( sourceId )
            .getModel();
    }

    onGetFlowList(): CollectionOfFlows {
        return this.nmosMediator
            .getNode()
            .getAllFlowModels()
    }

    onGetFlow(flowId: string): FlowResource {
        return this.nmosMediator
            .getNode()
            .getFlow( flowId )
            .getModel();
    }

}