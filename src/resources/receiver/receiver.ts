import { 
    AudioReceiverResource, 
    ReceiverResource,
    ReceiverResource1
} from "../../schemas";

import { AppService } from "../../services/app-service";

import { ResourceCore    } from "../resource-core";
import { ConstraintRtp   } from "../constraint/constraint-rtp";
import { StageReceiver   } from "../stage/stage-receiver";
import { IReceiverConfig } from ".";
import { IReceiver } from "./i-receiver";

export class Receiver extends ResourceCore implements IReceiver {


    device_id: string;
    transport: string;
    interface_bindings: string[] = [];
    subscription: {
        sender_id: string,
        active: boolean
    }

    constraints: ConstraintRtp;
    staged: StageReceiver;

    constructor(appService: AppService, config: IReceiverConfig) {
        super(appService, config);

        this.device_id = config.device_id;

        this.constraints = new ConstraintRtp();
    }

    public getConstraints(): ConstraintRtp {
        return this.constraints;
    }

    public getStaged(): StageReceiver {
        return this.staged;
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