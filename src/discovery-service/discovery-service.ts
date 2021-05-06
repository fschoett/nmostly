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

            this.mdnsService.startHeartbeat(this.nmosMediator.getNode().id);

            await this.postDevicesToRegistry();
            await this.postSourcesToRegistry();
            await this.postFlowsToRegistry();
            await this.postSendersToRegistry();
            await this.postReceiversToRegistry();
        } catch (error) {
            console.error("DiscoveryService: postAllResourcesToRegistry: Error: ", error );
        }
    }

    private async postNodeToRegistry() {
        console.log("DiscoveryService: postNodeToRegistry");
        await this.nmosRegistryHttpClient.postResource(
            this.nmosMediator.getNode().getModel(), "node"
        );
    }

    private async postDevicesToRegistry() {
        console.log("DiscoveryService: postDevicesToRegistry");
        const deviceModels = this.nmosMediator
            .getNode()
            .getAllDeviceModels();

        deviceModels.forEach(async device => {
            await this.nmosRegistryHttpClient.postResource(device, "device")
        });
    }

    private async postSourcesToRegistry() {
        console.log("DiscoveryService: postSourceToRegistry");
        const sourceModels = this.nmosMediator
            .getNode()
            .getAllSourceModels();

        sourceModels.forEach(async source => {
            await this.nmosRegistryHttpClient.postResource(source, "source");
        });
    }

    private postReceiversToRegistry() {
        console.log("DiscoveryService: postReceiversToRegistry");
        const receiverModels = this.nmosMediator
            .getNode()
            .getAllReceiverModels();

        receiverModels.forEach(async receiver => {
            await this.nmosRegistryHttpClient.postResource(receiver, "receiver");
        });
    }

    private postSendersToRegistry() {
        console.log("DiscoveryService: postSendersToRegistry");
        const senderModels = this.nmosMediator
            .getNode()
            .getAllSenderModels();

        senderModels.forEach(async sender => {
            await this.nmosRegistryHttpClient.postResource(sender, "sender");
        });
    }

    private postFlowsToRegistry() {
        console.log("DiscoveryService: postFlowsToRegistry");
        const flowModels = this.nmosMediator
            .getNode()
            .getAllFlowModels();

        flowModels.forEach(async flow => {
            await this.nmosRegistryHttpClient.postResource(flow, "flow");
        });
    }

}