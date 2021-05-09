
export interface IMdnsServiceConfig{
    onNewRegistryFound( data: unknown ): void;
    interfaceIp? : string;
}