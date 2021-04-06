import { AppService } from "../../services/app-service";
import { ReceiverConfig } from "./receiver-config";
import { ReceiverModel } from "./receiver-model";

export class Receiver{
    private _id: string;

    constructor( private appService: AppService, private config: ReceiverConfig ){}

    public get id(){ return this._id }

    public getModel() : ReceiverModel {
        return new ReceiverModel();
    }

}