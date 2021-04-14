export interface IMdnsRegistryModel {
    ipv4: string;
    host: string;
    ptr : string;

    srv_port : number;
    srv_host : string;
    srv_priority: number;
    srv_weight: number;

    api_proto: string;
    api_ver: string[];
    api_auth: boolean;
    priority: number;
}