
interface INodeModel{
    id: string;
    version: string;
    label: string;
    href: string;
    hostname: string;
    caps: object;
    services: object[];
    // services: IServicesModel[]
}

export { INodeModel }