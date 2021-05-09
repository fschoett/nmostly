import {
    Constraints,
    ReceiverResource1,
    StagedReceiverResource,
    TransportType
} from "../../schemas";

import { ResourceCore } from "../resource-core";
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
            sender_id: null,
            transport_file: {
                data: null,
                type: null
            },
            transport_params: []
        }

        // this.setOnUpdateCallback( config.onUpdateCallback );
    }

    public getConstraints(): Constraints {
        return this.constraints;
    }

    public stage(stagedReceiver: StagedReceiverResource) {
        if (!stagedReceiver) return;
        if (!this.validateStagedInput(stagedReceiver)) return;

        let isUpdated = false;

        const currStagedKeyList = Object.keys(this.staged);
        const stagedReceiverKeys = Object.keys(stagedReceiver);

        // Update only valid keys of the staged object
        // Object assign would also add values that do not match the interface specs
        stagedReceiverKeys.forEach(currKey => {
            currStagedKeyList.some(el => {
                if (el == currKey) {
                    this.staged[el] = stagedReceiver[currKey]; // this led to overwriting of defaults!
                    // Object.assign( this.staged[ el], stagedReceiver[currKey]);
                    isUpdated = true;
                    return true;
                }
            });
        })

        if( isUpdated ) this.onUpdate();

        if (this.staged.activation.mode == "activate_immediate"){
            let tmpReturn = this.getStaged();

            tmpReturn.activation.activation_time = ((Date.now() / 1000).toString() + "000000").replace( ".", ":");
            tmpReturn.activation.requested_time = null;

            this.staged.activation.mode = null;
            this.staged.activation.requested_time = null;
            this.staged.activation.activation_time = null;

            this.onActivation();
            return tmpReturn;
        }

        return this.staged;
    }

    private validateStagedInput(stageSender: StagedReceiverResource): boolean {
        const currStagedKeyList = Object.keys(this.staged);
        const stagedSenderKeys = Object.keys(stageSender);

        if( stagedSenderKeys.length < 1 ) return false;

        let isValid = true;
        stagedSenderKeys.forEach(key => {
            let foundKey =currStagedKeyList.some(inputKey => inputKey === key)
            if (!foundKey) isValid = false;
        });
        
        return isValid;
    }

    private onActivation(){
        console.log("Receiver ", this.id, " was activated");
        
    }

    public getStaged(): StagedReceiverResource {
        return {
            activation: {
                mode: this.staged.activation.mode,
                activation_time: this.staged.activation.activation_time,
                requested_time: this.staged.activation.requested_time
            },
            master_enable: this.staged.master_enable,
            sender_id: this.staged.sender_id,
            transport_params: this.staged.transport_params,
            transport_file: this.staged.transport_file
        }
    }

    // TODO: Implement correct logic!
    public getActive(): StagedReceiverResource {
        return this.staged;
    }

    public getTransportType(): TransportType {
        return this.transport;
    }


    public getBaseReceiverModel(): ReceiverResource1 {
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