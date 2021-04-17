import express from "express";
import { NodeApi } from "../api/node-api";
import { returnJson } from "../utils/return-nmos-json";


export class RouterNmosApiNode{

    private _router;

    constructor( private nodeApi: NodeApi ){
        this._router = express();
        this.registerEndpoints();
    }

    get router() { return this._router }


    private registerEndpoints(){
        const  nodeApiRouter = this.router;
        nodeApiRouter.get("/", (req, res) => {
            returnJson(res, this.nodeApi.getNodeRoot());
        });

        nodeApiRouter.get("/self/", (req, res) => {
            returnJson(res, this.nodeApi.getSelf());
        });

        nodeApiRouter.get("/devices/", (req, res) => {
            returnJson(res, this.nodeApi.node.getAllDeviceModels())
        });

        nodeApiRouter.get("/devices/:id", (req, res) => {
            returnJson(res, this.nodeApi.node.getDevice(req.params.id).getModel());
        });

        nodeApiRouter.get("/receivers/", (req, res) => {
            returnJson(res, this.nodeApi.node.getAllReceiverModels());
        });

        nodeApiRouter.get("/receivers/:id", (req, res) => {
            returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getModel());
        });

        nodeApiRouter.get("/senders/", (req, res) => {
            returnJson(res, this.nodeApi.node.getAllSenderModels());
        });

        nodeApiRouter.get("/senders/:id", (req, res) => {
            returnJson(res, this.nodeApi.node.getSender(req.params.id).getModel());
        });

        nodeApiRouter.get("/sources/", (req, res) => {
            returnJson(res, this.nodeApi.node.getAllSourceModels());
        });

        nodeApiRouter.get("/sources/:id", (req, res) => {
            returnJson(res, this.nodeApi.node.getSource(req.params.id).getModel());
        });

        nodeApiRouter.get("/flows/", (req, res) => {
            returnJson(res, this.nodeApi.node.getAllFlowModels());
        });

        nodeApiRouter.get("/flows/:id", (req, res) => {
            returnJson(res, this.nodeApi.node.getFlow(req.params.id).getModel());
        });
    }
}