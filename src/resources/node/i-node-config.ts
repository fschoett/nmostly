import { NodeResource } from "../../schemas";
import { IResourceCoreConfig } from "../resource-core";

export interface INodeConfig extends IResourceCoreConfig {


    href:     string;
    hostname: string;

    // Theese options abstract more complicated nmos settings
    ipv4?: string;
    port?: number;

    // Alternatively scheme settings can be used directly
    services?:   NodeResource["services"];
    api?:        NodeResource["api"];
    clocks?:     NodeResource["clocks"];
    interfaces?: NodeResource["interfaces"];

}