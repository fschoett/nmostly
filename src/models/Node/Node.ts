import { IAppService } from "../../services/i-app-service";
import { Device } from "../device/device";

import { NodeConfig } from "./node-config";
import { NodeModel } from "./node-model";


export class Node{

    private id: string;
    private version: string;
    private label: string;
    private href: string;
    private hostname: string;
    private caps: object;
    private services: object[];

    private deviceList: Device[];

    constructor( private appService: IAppService, config: NodeConfig ){
        this.id = this.appService.utilsService.generateUuid();
        this.version = this.appService.utilsService.generateVersion();
        this.label = config.label;
        this.href = config.href;

        this.hostname = "";
        this.caps = {};
        this.services = [{}];

        this.deviceList = [];
    }

    addDevice( newDevice: Device ){
        this.deviceList.push( newDevice );
    }

    removeDevice( deviceId: string ){
        let foundIndex = this.deviceList
            .findIndex( currDevice => currDevice.id === deviceId );

        if( foundIndex === -1 ) return false;
        
        let removedDevice = this.deviceList.splice( foundIndex, 1 );
        return removedDevice;
    }

    public getId(){ return this.id }

    public getDeviceList(): Device[]{
        return this.deviceList;
    }

    public getDevice( deviceId: string ): Device{
        return this.deviceList.find( currDevice => currDevice.id === deviceId );
    }

    getModel(){
        const tmpModel: NodeModel = {
            id: this.id,
            version: this.version,
            label: this.label,
            href: this.href,
            caps : this.caps,
            hostname: this.hostname,
            services: this.services
        }
        return tmpModel;
    }

}