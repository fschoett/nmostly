
interface INodeModel{
    id: string;
    version: string;
    label: string;
    href: string;
    hostname: string;
    // services: IServicesModel[]
}

export { INodeModel }