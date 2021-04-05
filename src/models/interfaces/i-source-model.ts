export interface ISourceModel{
    id: string;
    version: string;
    label: string;
    description: string;
    format: string;
    caps: string[];
    tags: object;
    device_id: string;
    parents: string[];
    clock_name: string;
}


export interface ISourceModelConfig {
    label: string;
    description: string;
    device_id : string;
    format? : string;
}