import express from "express";
import { NodeApi } from "../api/node-api";
import { NmosError } from "../models/error";


export class NodeApiEndpoint {



    constructor(private nodeApi: NodeApi, private port: number) { }

    public start() {
        const app = express();
        const nodeApiRouter = express();

        app.use(this.nmosMiddlewareCors);

        app.get("/", (req, res) => { this.returnJson(res, ["x-nmos/"]) });
        app.get("/x-nmos/", (req, res) => { this.returnJson(res, ["node/"]) });
        app.get("/x-nmos/node/", (req, res) => { this.returnJson(res, ["v1.3/"]) });
        app.use("/x-nmos/node/v1.3/", nodeApiRouter);

        app.use(this.nmosMiddlewareNotFound);

        nodeApiRouter.get("/", (req, res) => {
            this.returnJson(res, this.nodeApi.getNodeRoot());
        });

        nodeApiRouter.get("/self/", (req, res) => {
            this.returnJson(res, this.nodeApi.getSelf());
        });

        nodeApiRouter.get("/devices/", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getAllDeviceModels())
        });

        nodeApiRouter.get("/devices/:id", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getDevice(req.params.id).getModel());
        });

        nodeApiRouter.get("/receivers/", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getAllReceiverModels());
        });

        nodeApiRouter.get("/receivers/:id", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getModel());
        });

        nodeApiRouter.get("/senders/", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getAllSenderModels());
        });

        nodeApiRouter.get("/senders/:id", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getSender(req.params.id).getModel());
        });

        nodeApiRouter.get("/sources/", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getAllSourceModels());
        });

        nodeApiRouter.get("/sources/:id", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getSource(req.params.id).getModel());
        });

        nodeApiRouter.get("/flows/", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getAllFlowModels());
        });

        nodeApiRouter.get("/flows/:id", (req, res) => {
            this.returnJson(res, this.nodeApi.node.getFlow(req.params.id).getModel());
        });

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

    private returnJson(res, body) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(body));
        res.end();
    }
}