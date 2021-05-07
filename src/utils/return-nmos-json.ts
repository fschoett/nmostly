
export function returnJson( expressResponse, jsonBody ){
        const returnVal = jsonBody || {};
        expressResponse.writeHead(200, { 'Content-Type': 'application/json' });
        expressResponse.write(JSON.stringify( returnVal ));
        expressResponse.end();
}