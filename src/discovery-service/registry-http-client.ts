import axios, { AxiosError, AxiosResponse } from "axios";
import { BaseResource } from "../schemas";
import { INmosRegistryClientConfig } from "./interfaces/i-nmos-registry-http-client-config";

const REGISTER_RESOURCE_PATH: string = "/x-nmos/registration/v1.3/resource";

export class RegistryHttpClient{

    private _registryHost: string;

    constructor( config: INmosRegistryClientConfig ) {
        this._registryHost = config.href;
    }

    get registryHost() { return this._registryHost;}

    set registryHost( newHost: string ){ this._registryHost = newHost;}


    public async postResource(model: BaseResource, type: string): Promise<AxiosResponse> {
        return new Promise(async (resolve, reject) => {
            // Configure On Success callback. If no callback was passed, use default callback
            // Build request url
            console.log(`RegistryHttpClient: postResource(${model.label}, ${type})`);
            
            const url: URL = new URL("http://" + this.registryHost);
            url.pathname = `${REGISTER_RESOURCE_PATH}/`;
            const urlString = url.toString();

            const requestBody = {
                type: type,
                data: model
            };

            // Perform the http request with the help of the axios api
            try {
                const response = await axios.post(urlString, requestBody);
                resolve(response);
            } catch (error) {
                // console.log(error);
                reject(error);
            }
        })
    }

}