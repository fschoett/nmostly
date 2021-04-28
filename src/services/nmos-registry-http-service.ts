import axios, { AxiosAdapter, AxiosResponse } from "axios";
import { IDeviceModel } from "../resources/device";
import { Flow, IFlowModel } from "../resources/flow";
import { INodeModel } from "../resources/node";
import { IReceiverModel } from "../resources/receiver";
import { IResourceCoreModel } from "../resources/resource-core";
import { ISenderModel } from "../resources/sender";
import { ISourceModel } from "../resources/source";


const REGISTER_RESOURCE_PATH: string = "/x-nmos/registration/v1.3/resource";


export class NmosRegistryHttpService {


    private _registryHost: string;

    constructor(registryHost?: string) {
        this._registryHost = registryHost;
    }

    get registryHost() { return this._registryHost;}

    set registryHost( newHost: string ){ this._registryHost = newHost;}

    public async postResource(model: IResourceCoreModel, type: string): Promise<AxiosResponse> {
        return new Promise(async (resolve, reject) => {
            // Configure On Success callback. If no callback was passed, use default callback
            // Build request url
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

    public async updateResource( model: IResourceCoreModel ){

    }
}