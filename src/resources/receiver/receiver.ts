import { 
    Constraints,
    ReceiverResource1,
    StagedReceiverResource,
    TransportType
} from "../../schemas";

import { AppService } from "../../services/app-service";

import { ResourceCore    } from "../resource-core";
import { ConstraintRtp   } from "../constraint/constraint-rtp";
import { IReceiverConfig } from ".";
import { IReceiver } from "./i-receiver";

export class Receiver extends ResourceCore implements IReceiver {


    device_id: string;
    interface_bindings: string[] = [];
    subscription: {
        sender_id: string,
        active: boolean
    }

    staged: StagedReceiverResource;

    private transport: TransportType;
    private constraints: Constraints;
    private onUpdateCallback;

    constructor(appService: AppService, config: IReceiverConfig) {
        super(appService, config);
        this.transport = config.transport || "urn:x-nmos:transport:rtp";
        this.device_id = config.device_id;
        this.constraints = null;
        this.onUpdateCallback = config.onUpdateCallback || ( ()=> console.warn("Update Callback not implemented yet") )
    }

    private onUpdate(){
        this.version = this.appService.utilsService.generateVersion();
        this.onUpdateCallback( this );
    }

    public getConstraints(): Constraints{
        return this.constraints;
    }

    public stage( stagedReceiver: StagedReceiverResource ){
        this.staged = stagedReceiver;

        if( this.staged.activation.mode == "activate_immediate" ){
            this.onUpdate();
        }
    }

    public getStaged(): StagedReceiverResource {
        return this.staged;
    }

    // TODO: Implement correct logic!
    public getActive(): StagedReceiverResource {
        return this.staged;
    }

    public getTransportType(): TransportType {
        return this.transport;
    }


    public getBaseReceiverModel(): ReceiverResource1{
        return {
            ...this.getBaseResource(),

            device_id: this.device_id,
            transport: this.transport,
            interface_bindings: this.interface_bindings,
            subscription: this.subscription
        };
    }
}