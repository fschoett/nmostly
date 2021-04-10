import { IResourceCoreModel } from "../resource-core";

export interface INodeModel extends IResourceCoreModel{
    href: string;
    hostname: string;
    caps: object;
    services: object[];
}