import { IResourceCoreConfig } from "../resource-config/i-resource-core-config";

export interface INodeConfig extends IResourceCoreConfig {
    href: string;
    hostname: string;
}