import { 
    AudioReceiverResource, 
    ReceiverResource
} from "../../schemas";

import { AppService } from "../../services/app-service";

import { ResourceCore    } from "../resource-core";
import { ConstraintRtp   } from "../constraint/constraint-rtp";
import { StageReceiver   } from "../stage/stage-receiver";
import { IReceiverConfig } from ".";

export class Receiver extends ResourceCore {


    device_id: string;
    transport: string;
    interface_bindings: string[] = [];
    subscription: {
        sender_id: string,
        active: boolean
    }

    constraints: ConstraintRtp;
    staged: StageReceiver;
    format: AudioReceiverResource["format"];

    caps: AudioReceiverResource["caps"] = {
        media_types: ["audio/L16"]
    };

    constructor(appService: AppService, config: IReceiverConfig) {
        super(appService, config);

        this.device_id = config.device_id;

        this.constraints = new ConstraintRtp();
        this.format = "urn:x-nmos:format:audio";
    }

    public getConstraints(): ConstraintRtp {
        return this.constraints;
    }

    public getStaged(): StageReceiver {
        return this.staged;
    }

    public getModel(): ReceiverResource {
        const receiver: AudioReceiverResource = {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.label,
            tags: this.tags,

            device_id: this.device_id,
            transport: this.transport,
            interface_bindings: this.interface_bindings,
            subscription: this.subscription,
            format: this.format,
            caps: this.caps,
        };
        return receiver;
    }
}