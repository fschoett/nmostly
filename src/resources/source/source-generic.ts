import { Source } from ".";
import { GenericSourceResource } from "../../schemas/is-04-discovery-api/source";
import { IAppService } from "../../services/i-app-service";
import { ISourceConfig } from "./i-source-config";

export class SourceGeneric extends Source {

    private format: GenericSourceResource["format"] = "urn:x-nmos:format:mux";

    constructor( appService: IAppService, config: ISourceConfig ){
        super( appService, config );
    }


    public getModel(): GenericSourceResource{
        return{
            ...super.getBaseSourceModel(),

            format: this.format
        };
    }
}