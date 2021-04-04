export interface IMdnsClientService{
    registerNode(): Promise<boolean>;
}