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
        const currDevice = this.nmosMediator
            .getNode()
            .getDevice(deviceId)
        
        return currDevice ? currDevice.getModel() : null;
    }

    onGetReceiverList(): CollectionOfReceivers {
        return this.nmosMediator
            .getNode()
            .getAllReceiverModels()
    }

    onGetReceiver(receiverId: string): ReceiverResource {
        const currReceiver = this.nmosMediator
            .getNode()
            .getReceiver(receiverId)
        
        return currReceiver ? currReceiver.getModel() : null;
    }

    onGetSenderList(): CollectionOfSenders {
        return this.nmosMediator
            .getNode()
            .getAllSenderModels();
    }

    onGetSender(senderId: string): SenderResource {
        const currSender = this.nmosMediator
            .getNode()
            .getSender( senderId );

        return currSender ? currSender.getModel() : null;
    }

    onGetSourceList(): CollectionOfSources {
        return this.nmosMediator
            .getNode()
            .getAllSourceModels();
    }

    onGetSource(sourceId: string): SourceResource {
        const currSource = this.nmosMediator
            .getNode()
            .getSource( sourceId );
        
        return currSource ? currSource.getModel() : null;
    }

    onGetFlowList(): CollectionOfFlows {
        return this.nmosMediator
            .getNode()
            .getAllFlowModels()
    }

    onGetFlow(flowId: string): FlowResource {
        const currFlow =  this.nmosMediator
            .getNode()
            .getFlow( flowId );

        return currFlow ? currFlow.getModel() : null;
    }

}