import { IResourceCoreModel } from "../resource-config";

export interface INodeModel extends IResourceCoreModel{
    href: string;
    hostname: string;
    caps: object;
    services: object[];
}