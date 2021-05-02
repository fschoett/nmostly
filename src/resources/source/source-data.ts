import { Source } from ".";
import { DataSourceResource } from "../../schemas/is-04-discovery-api/source";
import { IAppService } from "../../services/i-app-service";
import { ISourceConfig } from "./i-source-config";


export class SourceData extends Source{

    private format: DataSourceResource["format"] = "urn:x-nmos:format:data";

    constructor( appService: IAppService, config: ISourceConfig) {
        super( appService, config );
    }

    public getModel(): DataSourceResource {
        return {
            ...super.getBaseSourceModel(),
            format: this.format
        }
    }
}