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
            interfaceIp: nmosMediator.getIp()
        });
    }

    private onNewRegistryFound(registry: unknown) {
        this.nmosRegistryHttpClient = new RegistryHttpClient({
            href: this.mdnsService.getHref()
        });
        this.postAllResourcesToRegistry();
    }

    public async postAllResourcesToRegistry() {
        try {

            let nodeRes = await this.postNodeToRegistry();

            if ( !((nodeRes.status == 201) || (nodeRes.status == 200) || nodeRes.status == 400 )) {
                this.mdnsService.onRegistryError();
                return;
            }

            if( nodeRes.status == 400 ){ console.error( nodeRes )}

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


        return await Promise.all(sourceModels.map(async source => {
            try {
                return await this.nmosRegistryHttpClient.postResource(source, "source");
            } catch (error) {
                console.error(error.response.data);
                return error.response;

            }
        }));
    }

    public async postReceiversToRegistry() {
        const receiverModels = this.nmosMediator
            .getNode()
            .getAllReceiverModels();

        return await Promise.all(receiverModels.map(async receiver => {
            try {
                return await this.nmosRegistryHttpClient.postResource(receiver, "receiver");
            } catch (error) {
                console.error(error.response.data);
                return error.response;
            }
        }));
    }

    public async postSendersToRegistry() {
        const senderModels = this.nmosMediator
            .getNode()
            .getAllSenderModels();

        return await Promise.all(senderModels.map(async sender => {
            try {
                return await this.nmosRegistryHttpClient.postResource(sender, "sender");
            } catch (error) {
                console.error(error.response.data);
                return error.response;
            }
        }));
    }

    public async postFlowsToRegistry() {
        const flowModels = this.nmosMediator
            .getNode()
            .getAllFlowModels();

        let responses = await Promise.all(flowModels.map(async flow => {
            try {
                await this.nmosRegistryHttpClient.postResource(flow, "flow");
            } catch (error) {
                console.error(error.response.data);
                return error;
            }
        }));

        return responses;
    }

    public async updateResource(resource: any, type: string) {
        try {
            return await this.nmosRegistryHttpClient.postResource(resource, type);
        } catch (error) {
            console.error(error.response.data);
            return error.response;
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
