import { IAppService } from "../services/i-app-service";
import { IDeviceModel, IDeviceModelConfig } from "./Interfaces/i-device-model";
import { INodeModel } from "./Interfaces/i-node-model";

class NodeModelOld implements INodeModel{
    id: string;
    version: string;
    label: string;
    href: string;
    hostname: string;
    caps: object;
    services: object[];

    private _deviceList: IDeviceModel[] = [];

    constructor( appService: IAppService, label, href ){
        this.id = appService.utilsService.generateUuid();
        this.hostname = appService.getHostname();
        this.version = 
        this.href = href;
        this.label = label;
    }

    public addDevice( device: IDeviceModel ){
        this._deviceList.push( device );
    }

    public removeDevice( deviceId: string) {}


    public getSelf(): INodeModel {
        const clone : INodeModel = {
            id: this.id,
            version: this.version,
            label: this.label,
            href: this.href,
            hostname: this.hostname,
            caps: this.caps,
            services: this.services,
            getDeviceList: this.getDeviceList
        }
        return clone;
    }

    public getDeviceList(){
        return this._deviceList;
    }
}


export {
    NodeModelOld
};