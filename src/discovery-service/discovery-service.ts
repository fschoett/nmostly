import { INmosMediator } from "../api";
import { MdnsService } from "./mdns-service";
import { NmosRegistryHttpClient } from "./nmos-registry-http-client";

// Acts as the mediator/ Facade of the mdns service
export class DiscoveryService {

    private nmosRegistryHttpClient: NmosRegistryHttpClient;
    private mdnsService;

    constructor(private nmosMediator: INmosMediator) {
        this.mdnsService = new MdnsService({
            onNewRegistryFound: (data) => { this.onNewRegistryFound(data); }
        });
    }

    private onNewRegistryFound(registry: unknown) {
        console.log("Found a new registry!");
        this.nmosRegistryHttpClient = new NmosRegistryHttpClient({
            href: this.mdnsService.getRegistryHref
        });
        this.postAllResourcesToRegistry();
    }

    private async postAllResourcesToRegistry() {
        await this.postNodeToRegistry();
        await this.postDevicesToRegistry();
        await this.postSourcesToRegistry();
        await this.postFlowsToRegistry();
        await this.postSendersToRegistry();
        await this.postReceiversToRegistry();
    }

    private async postNodeToRegistry() {
        await this.nmosRegistryHttpClient.postResource(
            this.nmosMediator.getNode().getModel(), "node"
        );
    }

    private async postDevicesToRegistry() {
        const deviceModels = this.nmosMediator
            .getNode()
            .getAllDeviceModels();

        deviceModels.forEach(async device => {
            await this.nmosRegistryHttpClient.postResource(device, "device")
        });
    }

    private async postSourcesToRegistry() {
        const sourceModels = this.nmosMediator
            .getNode()
            .getAllSourceModels();

        sourceModels.forEach(async source => {
            await this.nmosRegistryHttpClient.postResource(source, "source");
        });
    }

    private postReceiversToRegistry() {
        const receiverModels = this.nmosMediator
            .getNode()
            .getAllReceiverModels();

        receiverModels.forEach(async receiver => {
            await this.nmosRegistryHttpClient.postResource(receiver, "receiver");
        });
    }

    private postSendersToRegistry() {
        const senderModels = this.nmosMediator
            .getNode()
            .getAllSenderModels();

        senderModels.forEach(async sender => {
            await this.nmosRegistryHttpClient.postResource(sender, "sender");
        });
    }

    private postFlowsToRegistry() {
        const flowModels = this.nmosMediator
            .getNode()
            .getAllFlowModels();

        flowModels.forEach(async flow => {
            await this.nmosRegistryHttpClient.postResource(flow, "flow");
        });
    }

}