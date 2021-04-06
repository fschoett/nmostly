import { FormatEnum } from "../format-enums";

export interface IDeviceModel{
    id:string;
    version: string;
    label: string;
    node_id: string;
    senders: string[];
    receivers: string[];
    type: FormatEnum;
};

export interface IDeviceModelConfig{
    label: string;
    node_id?: string;
}