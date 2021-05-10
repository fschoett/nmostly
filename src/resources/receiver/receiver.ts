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
    active: StagedReceiverResource;

    private transport: TransportType;
    private constraints: Constraints;

    constructor(appService: AppService, config: IReceiverConfig) {
        super(appService, config);
        this.transport = config.transport || "urn:x-nmos:transport:rtp";
        this.device_id = config.device_id;

        this.constraints = this.createDefaultConstraintObject();

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
            transport_params: this.createDummyStagedResource()
        }

        this.active = {
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
            transport_params: this.createDummyActiveResource()
        };

        // this.setOnUpdateCallback( config.onUpdateCallback );
    }

    public getConstraints(): Constraints {
        return this.constraints;
    }

    public stage(stagedReceiver: StagedReceiverResource) {

        // Valiate input
        try {
            if( Object.keys(stagedReceiver).length == 0 ){ // {} should return the staged object according to spec
                return this.getStaged();
            }
            if (!this.validateStagedInput(stagedReceiver)) return;
        } catch (error) {
            return;
        }

        let isUpdated = false;

        const currStagedKeyList = Object.keys(this.staged);
        const stagedReceiverKeys = Object.keys(stagedReceiver);

        // Update only valid keys of the staged object
        // Object assign would also add values that do not match the interface specs
        stagedReceiverKeys.forEach(currKey => {
            currStagedKeyList.some(el => {
                if (el == currKey) {
                    if (el === "transport_params") {
                        Object.assign(this.staged[el][0], stagedReceiver[currKey][0]);
                    }
                    else {
                        this.staged[el] = stagedReceiver[currKey];
                    }
                    isUpdated = true;
                    return true;
                }
            });
        })


        if (this.staged.activation.mode == "activate_immediate") {
            let tmpReturn = this.getStaged();

            tmpReturn.activation.activation_time = ((Date.now() / 1000).toString() + "000000").replace(".", ":");
            tmpReturn.activation.requested_time = null;

            this.staged.activation.mode = null;
            this.staged.activation.requested_time = null;
            this.staged.activation.activation_time = null;

            this.onActivation( true );
            return tmpReturn;
        }

        if (isUpdated) this.onUpdate();

        return this.staged;
    }

    private validateStagedInput(stageSender: StagedReceiverResource): boolean {
        const currStagedKeyList = Object.keys(this.staged);
        const stagedSenderKeys = Object.keys(stageSender);

        if (stagedSenderKeys.length < 1) return false;

        let isValid = true;
        stagedSenderKeys.forEach(key => {
            let foundKey = currStagedKeyList.some(inputKey => inputKey === key)
            if (!foundKey) isValid = false;
        });

        return isValid;
    }

    private onActivation( isActivated?: boolean ) {
        this.subscription.active = true;
        this.onUpdate();
        Object.assign( this.active.transport_params[0], this.staged.transport_params[0] );

        // Replace all auto values
        for( let key in this.active.transport_params[0] ){
            if( this.active.transport_params[0][key] === "auto"){
                this.active.transport_params[0][key] = this.createDummyStagedResource()[key];
            }
        }
        console.log("Receiver ", this.id, " was activated");

    }

    public getStaged(): StagedReceiverResource {
        return {
            activation: {
                mode: this.staged.activation.mode || null,
                activation_time: this.staged.activation.activation_time || null,
                requested_time: this.staged.activation.requested_time || null
            },
            master_enable: this.staged.master_enable || false,
            sender_id: this.staged.sender_id || null,
            transport_params: this.staged.transport_params,
            transport_file: this.staged.transport_file || { data: null, type: null }
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

    private createDefaultConstraintObject(): Constraints {
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

    private createDummyStagedResource(): StagedReceiverResource["transport_params"] {
        return [{
            destination_port: "auto",
            fec1D_destination_port: "auto",
            fec2D_destination_port: "auto",
            fec_destination_ip: "auto",
            fec_enabled: false,
            fec_mode: "1D",
            interface_ip: "auto",
            multicast_ip: null,
            rtcp_destination_ip: "auto",
            rtcp_destination_port: "auto",
            rtcp_enabled: false,
            rtp_enabled: true,
            source_ip: null
        }]
    }

    private createDummyActiveResource(): StagedReceiverResource["transport_params"] {
        return [{
            destination_port: 5004,
            fec1D_destination_port: 5006,
            fec2D_destination_port: 5008,
            fec_destination_ip: "172.23.19.35",
            fec_enabled: false,
            fec_mode: "1D",
            interface_ip: "172.23.19.35",
            multicast_ip: null,
            rtcp_destination_ip: "172.23.19.35",
            rtcp_destination_port: 5005,
            rtcp_enabled: false,
            rtp_enabled: true,
            source_ip: null
        }]
    }
}