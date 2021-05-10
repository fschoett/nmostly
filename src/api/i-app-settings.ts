import { INodeConfig } from "../resources/node";

export interface IAppSettings {

    macAddr: string;
    ifaceName: string;
    ipv4: string;
    port: number;

    description?: string;
    label?: string;
    hostname?: string;

    nodeConfig? : INodeConfig;

}