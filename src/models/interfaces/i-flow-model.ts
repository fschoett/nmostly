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