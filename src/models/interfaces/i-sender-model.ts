// TODO!
export interface ISenderModel{
    id: string;
    version: string;
    label: string;
    description: string;
    flow_id: string;
    transport: string;
    device_id: string;
    manifest_href: string;
}


export interface ISenderModelConfig{
    label:string;
    description: string;
    flow_id: string;
    device_id: string;
}