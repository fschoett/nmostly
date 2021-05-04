import { INodeConfig, Node    } from "../resources/node";
import { IDeviceConfig        } from "../resources/device";
import { IReceiverAudioConfig } from "../resources/receiver";
import { ISenderConfig } from "../resources/sender";
import { ISourceConfig } from "../resources/source";

export interface INmosMediator{

    // getters
    getNode(): Node;

    // setters/ (or better adders?)
    // Should abstract/ simplify the creation of resources by providing simple interfaces/ functions to work with
    // Note: AddNode is implemented in the constructor of the mediator
    addDevice( config: IDeviceConfig ): string;
    addSource( config: ISourceConfig, deviceId: string ): string;
    addSender( config: ISenderConfig, flowId: string   ): string;
    addReceiverAudio( config: IReceiverAudioConfig, deviceId: string ): string;

    // removing/ changing devices directly on the node object!
}