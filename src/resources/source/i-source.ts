import { SourceResource, SourceResource1 } from "../../schemas/is-04-discovery-api/source";
import { IFlow } from "../flow/i-flow";

export interface ISource{
    id: string;
    getModel?(): SourceResource;
    getFlow(): IFlow;
    getBaseSourceModel(): SourceResource1;
}