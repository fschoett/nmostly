import { DataSourceResource } from "../../schemas";
import { IAppService } from "../../services/interfaces/i-app-service";
import { Source, ISourceConfig } from ".";

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