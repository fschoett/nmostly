import { IAppService } from "../../services/i-app-service";
import { SourceResource, SourceResource1 } from "../../schemas";

import { ResourceCore } from "../resource-core";
import { IFlow, FlowRawAudio } from "../flow";
import { ISource, ISourceConfig } from ".";

export class Source extends ResourceCore implements ISource{

    private caps: SourceResource["caps"];
    private device_id: string;
    private parents: string[] = [];
    private clock_name: string;

    private _flow: IFlow;

    constructor( appService: IAppService, config: ISourceConfig ){
        super( appService, config );

        this.device_id = config.device_id;
        this.parents = config.parents;
        this.clock_name = config.clock_name;

        this._flow = new FlowRawAudio( appService, {
            description: "First Flow",
            label: "First label",
            source_id: this.id,
            device_id: this.device_id,
            tags: {},
            sample_rate: 48000,
            bit_depth: 16
        });
    }


    // public get flow(){ return this._flow; }
    public getFlow(): IFlow { return this._flow }

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