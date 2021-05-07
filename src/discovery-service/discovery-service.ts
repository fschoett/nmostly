import { INmosMediator } from "../api";
import { MdnsService } from "./mdns-service";
import { RegistryHttpClient } from "./registry-http-client";

// Acts as the mediator/ Facade of the mdns service
export class DiscoveryService {

    private nmosRegistryHttpClient: RegistryHttpClient;
    private mdnsService: MdnsService;

    constructor(private nmosMediator: INmosMediator) {
        this.mdnsService = new MdnsService({
            onNewRegistryFound: (data) => { this.onNewRegistryFound(data); }
        });
    }

    private onNewRegistryFound(registry: unknown) {
        console.log("DiscoveryService: onNewRegistryFound");
        this.nmosRegistryHttpClient = new RegistryHttpClient({
            href: this.mdnsService.getHref()
        });
        this.postAllResourcesToRegistry();
    }

    private async postAllResourcesToRegistry() {
        try {

            await this.postNodeToRegistry();
            await this.postDevicesToRegistry();
            await this.postSourcesToRegistry();
            await this.postFlowsToRegistry();
            await this.postSendersToRegistry();
            await this.postReceiversToRegistry();

            this.mdnsService.startHeartbeat(this.nmosMediator.getNode().id);
        } catch (error) {
            console.error("DiscoveryService: postAllResourcesToRegistry: Error: ", error.response.data.error, error.response.data.debug);
        }
    }

    private async postNodeToRegistry() {
        console.log("DiscoveryService: postNodeToRegistry");
        const res = await this.nmosRegistryHttpClient.postResource(
            this.nmosMediator.getNode().getModel(), "node"
        );
        console.log("DiscoveryService: postNodeToRegistry: Success", res.status);

    }

    private async postDevicesToRegistry() {
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

    private async postSourcesToRegistry() {
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

    private async postReceiversToRegistry() {
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

    private async postSendersToRegistry() {
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

    private async postFlowsToRegistry() {
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

}