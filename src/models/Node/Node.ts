import { IAppService } from "../../services/i-app-service";
import { Device } from "../device/device";
import { ResourceCore } from "../resource-core/resource-core";

import { INodeConfig } from "./i-node-config";
import { INodeModel } from "./i-node-model";


export class Node extends ResourceCore{

    private href: string;
    private caps: object;
    private services: object[];

    private deviceList: Device[];

    hostname: string;

    api = {
        versions : [
            "v1.3"
        ],
        endpoints: [
            {
                host: "192.168.178.102",
                port: 5432,
                protocol: "http"
            }
        ]
    };
    clocks: object[] = [
        {
            name: "clk0",
            ref_type: "internal"
        }
    ];
    interfaces: object[] = [
        {
            chassis_id: "null",
            name: "eth0",
            port_id: "c8-08-e9-d1-ae-31"
        }
    ];

    constructor( appService: IAppService, config: INodeConfig ){
        super( appService, config );

        // this.href = config.href;
        this.href = "http://localhost:80/"
        this.caps = {};
        this.services = [];
        this.deviceList = [];
        this.hostname = "nmos-virtnode.local";
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
            label: this.label,
            description: this.description,
            tags: this.tags,
            href: this.href,
            caps: this.caps,
            api: this.api,
            services: this.services,
            clocks: this.clocks,
            interfaces: this.interfaces,
            hostname: this.hostname
        }
        return tmpModel;
    }

}