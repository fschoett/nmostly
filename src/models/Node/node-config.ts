import { IResourceCoreConfig } from "../resource-core/i-resource-core-config";

export interface INodeConfig extends IResourceCoreConfig {
    href: string;
    hostname: string;
}