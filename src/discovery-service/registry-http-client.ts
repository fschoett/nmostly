import axios, { AxiosError, AxiosResponse } from "axios";
import { BaseResource } from "../schemas";
import { INmosRegistryClientConfig } from "./interfaces/i-nmos-registry-http-client-config";

const REGISTER_RESOURCE_PATH: string = "/x-nmos/registration/v1.3/resource";
const DELETE_RESOURCE_PATH: string = "/x-nmos/registration/v1.3/resource";

export class RegistryHttpClient {

    private _registryHost: string;

    constructor(config: INmosRegistryClientConfig) {
        this._registryHost = config.href;
    }

    get registryHost() { return this._registryHost; }

    set registryHost(newHost: string) { this._registryHost = newHost; }


    public async postResource(model: BaseResource, type: string): Promise<AxiosResponse> {
        // Configure On Success callback. If no callback was passed, use default callback
        // Build request url
        console.log(`RegistryHttpClient: postResource(${model.label}, ${type})`);
        // console.log( `Host: ${this.registryHost}`);

        const url: URL = new URL("http://" + this.registryHost);
        url.pathname = `${REGISTER_RESOURCE_PATH}/`;
        const urlString = url.toString();

        console.log( urlString );

        const requestBody = {
            type: type,
            data: model
        };

        // Perform the http request with the help of the axios api
        try {
            const response = await axios.post(urlString, requestBody);
            return response;
        } catch (error) {
            console.log(error.response.status, type);
            return error.response;
        }
    }

    public async deleteResource(model: BaseResource, type: string): Promise<AxiosResponse> {
        // Configure On Success callback. If no callback was passed, use default callback
        // Build request url
        console.log(`RegistryHttpClient: deleteResource(${model.label}, ${type})`);
        // console.log( `Host: ${this.registryHost}`);

        const url: URL = new URL("http://" + this.registryHost);
        url.pathname = `${DELETE_RESOURCE_PATH}/${type}/${model.id}`;
        const urlString = url.toString();
        console.log( urlString );

        // Perform the http request with the help of the axios api
        try {
            const response = await axios.delete(urlString);
            return response;
        } catch (error) {
            console.log(error.response.status, type);
            return error.response;
        }
    }

}