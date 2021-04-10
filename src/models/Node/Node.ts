import { IAppService } from "../../services/i-app-service";
import { Device } from "../device/device";
import { ResourceCore } from "../resource-core/resource-core";

import { INodeConfig } from "./node-config";
import { INodeModel } from "./node-model";


export class Node extends ResourceCore{

    private href: string;
    private hostname: string;
    private caps: object;
    private services: object[];

    private deviceList: Device[];

    constructor( appService: IAppService, config: INodeConfig ){
        super( appService, config );

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
        const tmpModel: INodeModel = {
            id: this.id,
            version: this.version,
            description: this.description,
            label: this.label,
            tags: {},
            href: this.href,
            caps : this.caps,
            hostname: this.hostname,
            services: this.services
        }
        return tmpModel;
    }

}