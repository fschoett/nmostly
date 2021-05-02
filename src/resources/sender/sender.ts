import { SenderResource } from "../../schemas";

import { IAppService    } from "../../services/i-app-service";

import { ResourceCore  } from "../resource-core";
import { ConstraintRtp } from "../constraint/constraint-rtp";
import { StageSender   } from "../stage/stage-sender";
import { ISenderConfig } from ".";

export class Sender extends ResourceCore {

    flow_id: string;
    transport: string;
    device_id: string;
    manifest_href: string;
    interface_bindings: string[];
    subscription: { receiver_id: string; active: boolean; };

    constraints: ConstraintRtp;
    staged: StageSender;


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
    }

    public getConstraints(): ConstraintRtp {
        return this.constraints;
    }

    public getStaged(): StageSender {
        return this.staged;
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