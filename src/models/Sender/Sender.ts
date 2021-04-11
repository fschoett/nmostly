import { IAppService } from "../../services/i-app-service";
import { ResourceCore } from "../resource-core";
import { ISenderConfig } from "./i-sender-config";
import { ISenderModel } from "./i-sender-model";

export class Sender extends ResourceCore implements ISenderModel{

    flow_id: string;
    transport: string;
    device_id: string;
    manifest_href: string;
    interface_bindings: string[];
    subscription: { receiver_id: string; active: boolean; };

    constructor( appService: IAppService, config: ISenderConfig){
        super( appService, config );
        this.flow_id = config.flow_id;
        this.transport = "urn:x-nmos:transport:";
        this.device_id = config.device_id;
        this.manifest_href = null;
        this.interface_bindings = [];
        this.subscription = {
            receiver_id: null,
            active: false
        };
    }


    public getModel(): ISenderModel {
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
        }
    }
}