import { 
    Constraints,
    ReceiverResource1,
    StagedReceiverResource,
    TransportType
} from "../../schemas";

import { ResourceCore    } from "../resource-core";
import { IReceiverConfig } from ".";
import { IReceiver } from "./i-receiver";

import { AppService } from "../../utils";

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

    constructor(appService: AppService, config: IReceiverConfig) {
        super(appService, config);
        this.transport = config.transport || "urn:x-nmos:transport:rtp";
        this.device_id = config.device_id;

        this.constraints = this.createEmptyConstraintObject();

        this.subscription = config.subscription || {
            active: false,
            sender_id: null
        };

        this.staged = {
            activation: {
                mode: null,
                requested_time: null,
                activation_time: null
            },
            master_enable: false,
            sender_id:  null,
            transport_file: {
                data: null,
                type: null
            },
            transport_params: []
        }

        // this.setOnUpdateCallback( config.onUpdateCallback );
    }

    public getConstraints(): Constraints{
        return this.constraints;
    }

    public stage( stagedReceiver: StagedReceiverResource ){
        if( !stagedReceiver ) return;

        console.log( "Activate receiver!")
        this.staged = stagedReceiver;

        if( this.staged.activation.mode == "activate_immediate" ){
            this.onUpdate();
        }
    }

    public getStaged(): StagedReceiverResource {
        // TODO: Better suited in constructor?
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


    private createEmptyConstraintObject(): Constraints {
        return [{
            destination_port: {},
            fec1D_destination_port: {},
            fec2D_destination_port: {},
            fec_destination_ip: {},
            fec_enabled: {},
            fec_mode: {},
            interface_ip: {},
            multicast_ip: {},
            rtcp_destination_ip: {},
            rtcp_destination_port: {},
            rtcp_enabled: {},
            rtp_enabled: {},
            source_ip: {}
        }]
    }
}