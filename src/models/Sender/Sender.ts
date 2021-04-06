import { IAppService } from "../../services/i-app-service";
import { SenderConfig } from "./sender-config";
import { SenderModel } from "./sender-model";

export class Sender{
    private _id: string;

    constructor( private appService: IAppService, config: SenderConfig){}

    public get id(){ return this._id }

    public getModel(): SenderModel {
        return new SenderModel();
    }
}