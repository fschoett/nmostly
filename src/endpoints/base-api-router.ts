import express from "express";
import { NodeApi } from "../api/node-api";
import { NmosError } from "../resources/error";
import { returnJson } from "../utils/return-nmos-json";
import { RouterNmosApiConnection} from "./connection-api-router";
import { RouterNmosApiNode } from "./discovery-api-router";


export class BaseApiController{

    private _router;

    constructor(private nodeApi: NodeApi, private port: number) { 
        this._router = express();
    }

    get router() { return this._router; }

    public start() {

        const app = this.router;

        const nodeApiRouter = new RouterNmosApiNode( this.nodeApi, this.nodeApi ).router;
        const connectionApiRouter = new RouterNmosApiConnection( this.nodeApi, this.nodeApi ).router;

        app.use(this.nmosMiddlewareCors);

        app.get("/", (req, res) => { returnJson(res, ["x-nmos/"]) });
        app.get("/x-nmos/", (req, res) => {returnJson(res, ["node/"]) });

        app.get("/x-nmos/node/", (req, res) => {returnJson(res, ["v1.3/"]) });
        app.get("/x-nmos/connection/", (req, res) => {returnJson(res, ["v1.1/"]) });

        app.use("/x-nmos/node/v1.3/", nodeApiRouter);
        app.use("/x-nmos/connection/v1.1/", connectionApiRouter);

        app.use(this.nmosMiddlewareNotFound);

        app.listen(this.port, () => {
            console.log("Started NMOS Server");
        });
    }

    private nmosMiddlewareNotFound(req, res, next) {
        res.status(404).send(new NmosError({
            code: 404,
            debug: "",
            error: "Not Found!"
        }));
    }

    private nmosMiddlewareCors(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, HEAD, OPTIONS, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
        res.header("Access-Control-Max-Age", "3600");

        if (req.method == 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    }
}