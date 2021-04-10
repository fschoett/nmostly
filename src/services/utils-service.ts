import { IUtilsService } from "./i-utils-service";
import { v4 as uuidv4 } from "uuid";

export class UtilsService implements IUtilsService{
    generateVersion(): string {
        return Date.now().toPrecision() + ":000000000";
    }
    generateUuid(): string {

        return uuidv4();
    }

}