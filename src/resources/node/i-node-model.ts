import { IResourceCoreModel } from "../resource-core";

export interface INodeModel extends IResourceCoreModel{
    href: string;
    caps: object;
    api: {
        versions: string[],
        endpoints: object[]
    }
    services: object[];
    clocks: object[];
    interfaces: object[];
    hostname: string
}