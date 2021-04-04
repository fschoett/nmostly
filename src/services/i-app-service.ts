import { ILogger } from "./i-logger";
import { IMdnsClientService } from "./i-mdns-client-service";
import { IUtilsService } from "./i-utils-service";

interface IAppService{
    getHostname(): string;
    utilsService: IUtilsService;
    mdnsService: IMdnsClientService
}

export { IAppService }