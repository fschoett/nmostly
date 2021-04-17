import { AppService } from "../../services/app-service";
import { ConstraintRtp } from "../constraint/constraint-rtp";
import { ResourceCore } from "../resource-core";
import { StageReceiver } from "../stage/stage-receiver";
import { IReceiverConfig } from "./i-receiver-config";
import { IReceiverModel } from "./i-receiver-model";

export class Receiver extends ResourceCore{

    // TODO: add subscription class

    device_id: string;
    transport: string;
    interface_bindings: string [] = [];
    subscription: {
        sender_id: string,
        active: boolean
    }

    constraints: ConstraintRtp;
    staged: StageReceiver;

    constructor( appService: AppService, config: IReceiverConfig ){
        super( appService, config );

        this.device_id = config.device_id;

        this.constraints = new ConstraintRtp();
    }

    public getConstraints(): ConstraintRtp{
        return this.constraints;
    }

    public getStaged(): StageReceiver{
        return this.staged;
    }

    public getModel() : IReceiverModel {
        return {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            transport: "urn:x-nmos:transport:",
            device_id: this.device_id,
            subscription: this.subscription,
            interface_bindings: this.interface_bindings,
            tags: this.tags
        };
    }

}