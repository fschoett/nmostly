export interface IMdnsAnswer{
    name: string;
    type: string;
    ttl: number;
    class: string;
    flush: boolean;
    data: any;
}