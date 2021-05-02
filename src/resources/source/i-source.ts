import { SourceResource, SourceResource1 } from "../../schemas/is-04-discovery-api/source";
import { Flow } from "../flow";

export interface ISource{
    id: string;
    getModel?(): SourceResource;
    getFlow(): Flow;
    getBaseSourceModel(): SourceResource1;
}