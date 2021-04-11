import { IResourceCoreModel } from "../resource-core";

export interface ISourceModel extends IResourceCoreModel{
    format: string;
    caps: object;
    device_id: string;
    parents: string[];
    clock_name: string;
}