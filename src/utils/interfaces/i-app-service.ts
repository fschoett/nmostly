import { ILogger } from "./i-logger";
import { IMdnsClientService } from "../../mdns-service/interfaces/i-mdns-client-service";
import { IUtilsService } from "./i-utils-service";

interface IAppService{
    getHostname(): string;
    utilsService: IUtilsService;
}

export { IAppService }