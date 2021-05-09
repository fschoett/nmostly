import { NmosError } from "../resources/error";

export function return400( expressResponse, errorMsg: string ){
    const nmosError: NmosError = new NmosError({
        code: 400,
        error: errorMsg,
        debug: ""
    });
    expressResponse.writeHead( 400 , { 'Content-Type': 'application/json' });
    expressResponse.write(JSON.stringify( nmosError.getModel() ));
    expressResponse.end();

}