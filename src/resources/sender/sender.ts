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
    staged: StageSender;

    staged_2: StagedSenderResource;
    
    activationStatus: boolean;

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
        this.staged = new StageSender();
        // add callback as parameter if sender is staged and activated!
    }

    public updateResource( updatedSender: SenderResource )
    {
        this.version = this.appService.utilsService.generateVersion();
        this.flow_id = updatedSender.flow_id;
        this.staged.activation = updatedSender.activation;
        // this.flow_id = updatedSender.jI
    }

    public stage( updatedSender: StagedSenderResource ){
        this.staged_2 = updatedSender;
    }

    public activateStaged(){
        this.version = this.appService.utilsService.generateVersion();
        // get information from staged sender and update them
    }

    public isActive(): boolean {
        return this.activationStatus;
    }

    public getConstraints(): ConstraintRtp {
        return this.constraints;
    }

    public getStaged(): StageSender {
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