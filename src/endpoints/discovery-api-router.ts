import express from "express";

import { NodeApi } from "../api/node-api";

import { IDiscoveryApiController } from "../controllers/i-discovery-api-controller";

import {
    NodeAPIBaseResource,
    NodeResource,
    CollectionOfDevices,
    DeviceResource,
    CollectionOfReceivers,
    ReceiverResource,
    CollectionOfSenders,
    SenderResource,
    CollectionOfSources,
    SourceResource,
    CollectionOfFlows,
    FlowResource
} from "../schemas";

import { returnJson } from "../utils/return-nmos-json";


export class RouterNmosApiNode{

    private _router;

    constructor( private nodeApi: NodeApi, private discApiController: IDiscoveryApiController ){
        this._router = express();
        this.registerEndpoints();
    }

    get router() { return this._router }


    private registerEndpoints(){
        const  nodeApiRouter = this.router;
        const cntrlr = this.discApiController;
        nodeApiRouter.get("/", (req, res) => {
            const response: NodeAPIBaseResource = cntrlr.onGetRoot();
            // returnJson(res, this.nodeApi.getNodeRoot());
            returnJson( res, response );
        });

        nodeApiRouter.get("/self/", (req, res) => {
            const response: NodeResource = cntrlr.onGetSelf();
            returnJson( res, response );
            //returnJson(res, this.nodeApi.getSelf());
        });

        nodeApiRouter.get("/devices/", (req, res) => {
            const response: CollectionOfDevices = cntrlr.onGetDeviceList();
            returnJson( res, response );
            //returnJson(res, this.nodeApi.node.getAllDeviceModels())
        });

        nodeApiRouter.get("/devices/:id", (req, res) => {
            const deviceId = req.params.id;
            const response: DeviceResource= cntrlr.onGetDevice( deviceId );
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getDevice(req.params.id).getModel());
        });

        nodeApiRouter.get("/receivers/", (req, res) => {
            const response: CollectionOfReceivers= cntrlr.onGetReceiverList();
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getAllReceiverModels());
        });

        nodeApiRouter.get("/receivers/:id", (req, res) => {
            const receiverId = req.params.id;
            const response: ReceiverResource= cntrlr.onGetReceiver( receiverId );
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getModel());
        });

        nodeApiRouter.get("/senders/", (req, res) => {
            const response: CollectionOfSenders = cntrlr.onGetSenderList();
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getAllSenderModels());
        });

        nodeApiRouter.get("/senders/:id", (req, res) => {
            const senderId = req.params.id;
            const response: SenderResource = cntrlr.onGetSender( senderId );
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getSender(req.params.id).getModel());
        });

        nodeApiRouter.get("/sources/", (req, res) => {
            const response: CollectionOfSources = cntrlr.onGetSourceList();
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getAllSourceModels());
        });

        nodeApiRouter.get("/sources/:id", (req, res) => {
            const sourceId = req.params.id;
            const response: SourceResource = cntrlr.onGetSource( sourceId );
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getSource(req.params.id).getModel());
        });

        nodeApiRouter.get("/flows/", (req, res) => {
            const response: CollectionOfFlows = cntrlr.onGetFlowList();
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getAllFlowModels());
        });

        nodeApiRouter.get("/flows/:id", (req, res) => {
            const flowId = req.params.id;
            const response: FlowResource = cntrlr.onGetFlow( flowId );
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getFlow(req.params.id).getModel());
        });
    }
}