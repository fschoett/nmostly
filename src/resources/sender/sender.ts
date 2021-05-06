import { ResourceCore  } from "../resource-core";
import { ISenderConfig } from ".";
import { TransportFile } from "../../schemas/is-05-connection-api/generated/receiver-stage-schema";
import { Constraints, SenderResource, StagedSenderResource, TransportType } from "../../schemas";
import { IAppService } from "../../utils";

export class Sender extends ResourceCore {

    flow_id: string;
    device_id: string;
    manifest_href: string;
    interface_bindings: string[];
    subscription: { receiver_id: string; active: boolean; };

    constraints: Constraints;

    // Set defalt transport type to rtp
    private transport: TransportType;
    private staged: StagedSenderResource;
    // private onUpdateCallback;

    constructor(appService: IAppService, config: ISenderConfig) {
        super(appService, config);

        this.flow_id = config.flow_id;
        this.transport = config.transport ?? "urn:x-nmos:transport:rtp";
        this.device_id = config.device_id;
        this.manifest_href = null;
        this.interface_bindings = [];

        this.subscription = {
            receiver_id: null,
            active: false
        };

        this.constraints = null;

        this.setOnUpdateCallback( config.onUpdateCallback );
        // add callback as parameter if sender is staged and activated!
    }

    // Currently only immediate staging is implemented! 
    public stage( updatedSender: StagedSenderResource ){

        // update staged entry
        this.staged = updatedSender;

        // if staging is now, execute it
        if( this.staged.activation.mode == "activate_immediate" ){
            // call callback
            this.onUpdate();
        }
    }

    public isActive(): boolean {
        return this.staged ? this.staged.master_enable : false;
    }

    public getConstraints(): Constraints {
        return this.constraints;
    }

    public getStaged(): StagedSenderResource{
        return this.staged;
    }

    // TODO: Implement correct logic!
    public getActive(): StagedSenderResource{
        return this.staged;
    }

    public getTransportFile() : TransportFile{
        return null;
    }

    public getTransportType(): TransportType {
        return this.transport;
    }

    public getModel(): SenderResource {
        return {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            tags: this.tags,

            flow_id: this.flow_id,
            transport: this.transport,
            device_id: this.device_id,
            manifest_href: this.manifest_href,
            interface_bindings: this.interface_bindings,
            subscription: this.subscription
        };
    }
}