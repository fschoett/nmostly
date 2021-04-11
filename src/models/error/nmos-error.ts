import { INmosErrorConfig } from "./i-nmos-error-config";
import { INmosErrorModel } from "./i-nmos-error-model";

export class NmosError implements INmosErrorModel{

    code: number;
    error: string;
    debug: string;

    constructor( config: INmosErrorConfig ){
        this.code = config.code;
        this.error = config.error;
        this.debug = config.debug;
    }

    getModel(): INmosErrorModel{
        const nmosErrorModel: INmosErrorModel = {
            code: this.code,
            debug: this.debug,
            error: this.error
        }

        return nmosErrorModel;
    }
}