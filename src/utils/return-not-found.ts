import { NmosError } from "../resources/error";

export function returnNotFound( expressResponse ){
    const nmosError: NmosError = new NmosError({
        code: 404,
        error:"Not Found!",
        debug: ""
    });
    expressResponse.writeHead(200, { 'Content-Type': 'application/json' });
    expressResponse.write(JSON.stringify( nmosError.getModel() ));
    expressResponse.end();
}