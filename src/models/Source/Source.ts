import { IAppService } from "../../services/i-app-service";
import { Flow } from "../flow/Flow";
import { ResourceCore } from "../resource-core";
import { ISourceConfig } from "./i-source-config";
import { ISourceModel } from "./i-source-model";

export class Source extends ResourceCore{

    private format: string;
    private caps: object = {};
    private device_id: string;
    private parents: string[] = [];
    private clock_name: string;

    private _flow: Flow;

    constructor( appService: IAppService, config: ISourceConfig ){
        super( appService, config );

        this.format = "urn:x-nmos:format:video";
        this.caps = {};
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


    public get flow(){ return this._flow; }

    public getModel() : ISourceModel{
        return {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            tags: this.tags,

            format: this.format,
            caps: this.caps,
            device_id: this.device_id,
            parents: this.parents,
            clock_name: this.clock_name
        }
    }

}