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
    subscriptions: { receiver_id: string; active: boolean; };

    constructor( appService: IAppService, config: ISenderConfig){
        super( appService, config );
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
            subscriptions: this.subscriptions
        }
    }
}