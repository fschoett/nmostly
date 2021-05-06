import { IAppService } from "./interfaces/i-app-service";
import { IUtilsService } from "./interfaces/i-utils-service";
import { UtilsService } from "./utils-service";

export class AppService implements IAppService{
    getHostname(): string {
        return "localhost";
        // throw new Error("Method not implemented.");
    }
    utilsService: IUtilsService;

    constructor(){
        this.utilsService = new UtilsService();
    }

}