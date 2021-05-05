import { ResourceCore  } from "../resource-core";
import { ConstraintRtp } from "../constraint/constraint-rtp";
import { StageSender   } from "../stage/stage-sender";
import { ISenderConfig } from ".";
import { TransportFile } from "../../schemas/is-05-connection-api/generated/receiver-stage-schema";
import { SenderResource, StagedSenderResource } from "../../schemas";
import { IAppService } from "../../services";

export class Sender extends ResourceCore {

    flow_id: string;
    transport: string;
    device_id: string;
    manifest_href: string;
    interface_bindings: string[];
    subscription: { receiver_id: string; active: boolean; };

    constraints: ConstraintRtp;

    private staged: StagedSenderResource;
    private onUpdateCallback;

    constructor(appService: IAppService, config: ISenderConfig) {
        super(appService, config);
        this.flow_id = config.flow_id;
        this.transport = "urn:x-nmos:transport:";
        this.device_id = config.device_id;
        this.manifest_href = null;
        this.interface_bindings = [];
        this.subscription = {
            receiver_id: null,
            active: false
        };
        this.constraints = new ConstraintRtp();

        this.onUpdateCallback = config.onUpdateCallback;
        // add callback as parameter if sender is staged and activated!
    }

    private onUpdate( ){
        this.version = this.appService.utilsService.generateVersion();
        this.onUpdateCallback( this );
    }


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
        if( this.staged )
        {
            return this.staged.master_enable || false;
        }
        else{
            return false;
        }
    }

    public getConstraints(): ConstraintRtp {
        return this.constraints;
    }

    public getStaged(): StagedSenderResource{
        return this.staged;
    }

    public getTransportFile() : TransportFile{
        return null;
    }

    public getModel(): SenderResource {
        const senderModel: SenderResource = {
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
        return senderModel;
    }
}