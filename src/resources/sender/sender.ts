import { ResourceCore } from "../resource-core";
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

        this.staged = {
            activation: {
                mode: null,
                requested_time: null,
                activation_time: null
            },
            master_enable: false,
            receiver_id: null,
            transport_params: []
        };


        this.constraints = this.createEmptyConstraintObject();

        this.setOnUpdateCallback(config.onUpdateCallback);
        // add callback as parameter if sender is staged and activated!
    }

    // Currently only immediate staging is implemented! 
    public stage(updatedSender: StagedSenderResource) {
        if (!updatedSender) return;
        if (!this.validateStagedInput(updatedSender)) return;

        let isUpdated = false;

        const currStagedKeyList = Object.keys(this.staged);
        const stagedSenderKeys = Object.keys(updatedSender);

        // Update only valid keys of the staged object
        // Object assign would also add values that do not match the interface specs
        stagedSenderKeys.forEach(currKey => {
            currStagedKeyList.some(el => {
                if (el == currKey) {
                    this.staged[el] = updatedSender[currKey];
                    // Object.assign( this.staged[ el], updatedSender[currKey]);
                    isUpdated = true;
                    return true;
                }
            });
        })

        if (isUpdated) this.onUpdate();
        if (this.staged.activation.mode == "activate_immediate") {
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

    private validateStagedInput(stageSender: StagedSenderResource): boolean {
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

    private onActivation() {
        console.log("Sender ", this.id, " was activated");

    }

    public isActive(): boolean {
        return this.staged ? this.staged.master_enable : false;
    }

    public getConstraints(): Constraints {
        return this.constraints;
    }

    // Clone staged object
    public getStaged(): StagedSenderResource {
        return {
            activation: {
                mode: this.staged.activation.mode,
                activation_time: this.staged.activation.activation_time,
                requested_time: this.staged.activation.requested_time
            },
            master_enable: this.staged.master_enable,
            receiver_id: this.staged.receiver_id,
            transport_params: this.staged.transport_params
        }
    }

    // TODO: Implement correct logic!
    public getActive(): StagedSenderResource {
        return this.staged;
    }

    public getTransportFile(): TransportFile {
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