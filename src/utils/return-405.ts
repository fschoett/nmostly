
import { NmosError } from "../resources/error";

export function return405( expressResponse, errorMsg: string ){
    const nmosError: NmosError = new NmosError({
        code: 405,
        error: errorMsg || "",
        debug: ""
    });
    expressResponse.writeHead(  405, { 'Content-Type': 'application/json' });
    expressResponse.write(JSON.stringify( nmosError.getModel() ));
    expressResponse.end();

}