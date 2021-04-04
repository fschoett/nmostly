import { IMdnsClientService } from "./i-mdns-client-service";

export class MdnsClientService implements IMdnsClientService{
    registerNode(): Promise<boolean> {
        return new Promise( (resolve, reject ) => {
            setTimeout( ()=> {
                console.log("Registered Fake note!");
                resolve( true );
            }, 1000 );
        });
    }
}