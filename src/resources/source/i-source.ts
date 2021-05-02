import { SourceResource, SourceResource1 } from "../../schemas";
import { IFlow } from "../flow";

export interface ISource{
    id: string;
    getModel?(): SourceResource;
    getFlow(): IFlow;
    getBaseSourceModel(): SourceResource1;
}