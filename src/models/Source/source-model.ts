export class SourceModel{
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