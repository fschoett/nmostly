export interface IReceiverModel {
    id: string;
    version: string;
    label: string;
    description: string;
    format: string;
    caps: string[];
    tags: string[];
    device_id: string;
    transport: string;
    subscription: string;
}