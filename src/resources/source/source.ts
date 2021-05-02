import { SourceResource1 } from "../../schemas/is-04-discovery-api/source";
import { AudioSourceResource, Component, SourceResource } from "../../schemas/is-04-discovery-api/sources";
import { IAppService } from "../../services/i-app-service";
import { Flow } from "../flow";
// import { Flow } from "../flow/Flow";
import { ResourceCore } from "../resource-core";
import { ISource } from "./i-source";
import { ISourceConfig } from "./i-source-config";

export class Source extends ResourceCore implements ISource{

    private caps: SourceResource["caps"];
    private device_id: string;
    private parents: string[] = [];
    private clock_name: string;

    private _flow: Flow;

    constructor( appService: IAppService, config: ISourceConfig ){
        super( appService, config );

        this.device_id = config.device_id;
        this.parents = config.parents;
        this.clock_name = config.clock_name;

        this._flow = new Flow( appService, {
            description: "First Flow",
            label: "First label",
            source_id: this.id,
            device_id: this.device_id,
            tags: {}
        });
    }


    // public get flow(){ return this._flow; }
    public getFlow(){ return this._flow }

    public getBaseSourceModel(): SourceResource1 {
        return {
            ...this.getBaseResource(),

            caps: this.caps,
            device_id: this.device_id,
            parents: this.parents,
            clock_name: this.clock_name
        };
    }

}