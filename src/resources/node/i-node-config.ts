import { NodeResource } from "../../schemas";
import { IResourceCoreConfig } from "../resource-core";

export interface INodeConfig extends IResourceCoreConfig {

    href:     string;
    hostname: string;

    services:   NodeResource["services"];
    api:        NodeResource["api"];
    clocks:     NodeResource["clocks"];
    interfaces: NodeResource["interfaces"];

}