import { GenericSourceResource } from "../../schemas";
import { IAppService } from "../../services/interfaces/i-app-service";
import { Source, ISourceConfig } from ".";

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