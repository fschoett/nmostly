import { IUtilsService } from "./i-utils-service";
import { v4 as uuidv4 } from "uuid";

export class UtilsService implements IUtilsService{
    generateUuid(): string {

        return uuidv4();
    }

}