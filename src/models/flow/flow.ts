import { FlowModel } from "./flow-model";

export class Flow{

    private _id: string;
    private _device_id: string;

    public get id(){ return this._id }
    public get device_id (){ return this._device_id}

    public getModel(): FlowModel{
        return new FlowModel();
    }

}