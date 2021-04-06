import { IAppService } from "../../services/i-app-service";
import { Flow } from "../flow/Flow";
import { SourceConfig } from "./source-config";
import { SourceModel } from "./source-model";

export class Source{
    private _id: string;
    private _flow: Flow;

    constructor( private appService: IAppService, private config: SourceConfig ){}

    public get id(){ return this._id }

    public get flow(){ return this._flow; }

    public getModel() : SourceModel{
        return new SourceModel();
    }

}