import { IResourceCoreConfig } from "../resource-core";

export interface INodeConfig extends IResourceCoreConfig {
    href: string;
    hostname: string;
}