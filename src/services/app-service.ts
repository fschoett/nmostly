import { IAppService } from "./i-app-service";
import { ILogger } from "./i-logger";
import { IMdnsClientService } from "./i-mdns-client-service";
import { IUtilsService } from "./i-utils-service";
import { MdnsClientService } from "./mdns-client-service";
import { UtilsService } from "./utils-service";

export class AppService implements IAppService{
    getHostname(): string {
        return "localhost";
        // throw new Error("Method not implemented.");
    }
    utilsService: IUtilsService;
    mdnsService: IMdnsClientService;

    constructor(){
        this.utilsService = new UtilsService();
        this.mdnsService = new MdnsClientService();
    }

}