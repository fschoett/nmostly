import { INmosMediator } from "../api";
import { ResourceCore } from "../resources/resource-core";
import { MdnsService } from "./mdns-service";
import { RegistryHttpClient } from "./registry-http-client";

// Acts as the mediator/ Facade of the mdns service
export class DiscoveryService {

    private nmosRegistryHttpClient: RegistryHttpClient;
    private mdnsService: MdnsService;

    constructor(private nmosMediator: INmosMediator) {
        this.mdnsService = new MdnsService({
            onNewRegistryFound: (data) => { this.onNewRegistryFound(data); },
            interfaceIp: "192.168.178.41"
        });
    }

    private onNewRegistryFound(registry: unknown) {
        console.log("DiscoveryService: onNewRegistryFound");
        this.nmosRegistryHttpClient = new RegistryHttpClient({
            href: this.mdnsService.getHref()
        });
        this.postAllResourcesToRegistry();
    }

    public async postAllResourcesToRegistry() {
        try {

            let nodeRes = await this.postNodeToRegistry();

            if ( !((nodeRes.status == 201) || (nodeRes.status == 200) || nodeRes.status == 400 )) {
                console.log("Error while trying to post registry.. break!", nodeRes.statusText);
                this.mdnsService.onRegistryError();
                return;
            }

            if( nodeRes.status == 400 ){ console.log( nodeRes )}

            // this.mdnsService.startHeartbeat(this.nmosMediator.getNode().id);
            this.mdnsService.setNodeId(this.nmosMediator.getNode().id);

            await this.postDevicesToRegistry();
            await this.postSourcesToRegistry();
            await this.postFlowsToRegistry();
            await this.postSendersToRegistry();
            await this.postReceiversToRegistry();

        } catch (error) {
            console.error("DiscoveryService: postAllResourcesToRegistry: Error: ", error);
        }
    }

    public async postNodeToRegistry() {
        console.log("DiscoveryService: postNodeToRegistry");
        const res = await this.nmosRegistryHttpClient.postResource(
            this.nmosMediator.getNode().getModel(), "node"
        );

        // if res.status == 200 > try to unregister node first
        // if res.status == 4xx > do nothing. User interaction is needed!
        // is res.status == 409 > version conflict!

        return res;
    }

    public async postDevicesToRegistry() {
        const deviceModels = this.nmosMediator
            .getNode()
            .getAllDeviceModels();

            console.log( deviceModels.map( device => device.label ));

        // awaiting promise.all ensures, that all devices are sent before exiting the method
        await Promise.all(deviceModels.map(async device => {
            try {
                await this.nmosRegistryHttpClient.postResource(device, "device")
            } catch (error) {
                console.error(error.response.data);
            }
        }));
    }

    public async postSourcesToRegistry() {
        const sourceModels = this.nmosMediator
            .getNode()
            .getAllSourceModels();

        await Promise.all(sourceModels.map(async source => {
            try {
                await this.nmosRegistryHttpClient.postResource(source, "source");
            } catch (error) {
                console.log(error.response.data);

            }
        }));
    }

    public async postReceiversToRegistry() {
        console.log("DiscoveryService: postReceiversToRegistry");
        const receiverModels = this.nmosMediator
            .getNode()
            .getAllReceiverModels();

        await Promise.all(receiverModels.map(async receiver => {
            try {
                await this.nmosRegistryHttpClient.postResource(receiver, "receiver");
            } catch (error) {
                console.log(error.response.data);
            }
        }));
    }

    public async postSendersToRegistry() {
        console.log("DiscoveryService: postSendersToRegistry");
        const senderModels = this.nmosMediator
            .getNode()
            .getAllSenderModels();

        await Promise.all(senderModels.map(async sender => {
            try {
                await this.nmosRegistryHttpClient.postResource(sender, "sender");
            } catch (error) {
                console.log(error.response.data);
            }
        }));
    }

    public async postFlowsToRegistry() {
        console.log("DiscoveryService: postFlowsToRegistry");
        const flowModels = this.nmosMediator
            .getNode()
            .getAllFlowModels();

        await Promise.all(flowModels.map(async flow => {
            try {
                await this.nmosRegistryHttpClient.postResource(flow, "flow");
            } catch (error) {
                console.log(error.response.data);
            }
        }));
    }

    public async updateResource(resource: any, type: string) {
        try {
            await this.nmosRegistryHttpClient.postResource(resource, type);
            console.log("DiscoveryService: updatingResource ", resource.label, type);
        } catch (error) {
            console.log(error.response.data);
        }
    }

    public async removeResource( resource: any, type: string){
        try {
            await this.nmosRegistryHttpClient.deleteResource( resource, type );
        } catch (error) {
            console.error( error.response.data );
        }
    }

}