
export function returnJson( expressResponse, jsonBody ){
        expressResponse.writeHead(200, { 'Content-Type': 'application/json' });
        expressResponse.write(JSON.stringify( jsonBody ));
        expressResponse.end();
}