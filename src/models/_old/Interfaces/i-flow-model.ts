export interface IFlowModel{
    id: string;
    version: string;
    label: string;
    description: string;
    format: string;
    tags: string[];
    source_id: string;
    parents: string[];
}


export interface IFlowModelConfig{
    label: string;
    description: string;
    source_id: string;
    tags? : string [];
    format? : string;
}