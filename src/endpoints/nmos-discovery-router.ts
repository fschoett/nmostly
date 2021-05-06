import express from "express";

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


export class NmosDiscoveryRouter{

    // This is the express router instance which is used by express to route http traffic accrodingly
    // TODO: Make it private?
    public router;

    constructor( private discApiController: IDiscoveryApiController ){
        this.router = express();
        this.registerEndpoints();
    }

    private registerEndpoints(){
        const cntrlr = this.discApiController;

        this.router.get("/", (req, res) => {
            const response: NodeAPIBaseResource = cntrlr.onGetRoot();
            returnJson( res, response );
        });

        this.router.get("/self/", (req, res) => {
            const response: NodeResource = cntrlr.onGetSelf();
            returnJson( res, response );
        });

        this.router.get("/devices/", (req, res) => {
            const response: CollectionOfDevices = cntrlr.onGetDeviceList();
            returnJson( res, response );
        });

        this.router.get("/devices/:id", (req, res) => {
            const deviceId = req.params.id;
            const response: DeviceResource= cntrlr.onGetDevice( deviceId );
            returnJson( res, response );
        });

        this.router.get("/receivers/", (req, res) => {
            const response: CollectionOfReceivers= cntrlr.onGetReceiverList();
            returnJson( res, response );
        });

        this.router.get("/receivers/:id", (req, res) => {
            const receiverId = req.params.id;
            const response: ReceiverResource= cntrlr.onGetReceiver( receiverId );
            returnJson( res, response );
        });

        this.router.get("/senders/", (req, res) => {
            const response: CollectionOfSenders = cntrlr.onGetSenderList();
            returnJson( res, response );
        });

        this.router.get("/senders/:id", (req, res) => {
            const senderId = req.params.id;
            const response: SenderResource = cntrlr.onGetSender( senderId );
            returnJson( res, response );
        });

        this.router.get("/sources/", (req, res) => {
            const response: CollectionOfSources = cntrlr.onGetSourceList();
            returnJson( res, response );
        });

        this.router.get("/sources/:id", (req, res) => {
            const sourceId = req.params.id;
            const response: SourceResource = cntrlr.onGetSource( sourceId );
            returnJson( res, response );
        });

        this.router.get("/flows/", (req, res) => {
            const response: CollectionOfFlows = cntrlr.onGetFlowList();
            returnJson( res, response );
        });

        this.router.get("/flows/:id", (req, res) => {
            const flowId = req.params.id;
            const response: FlowResource = cntrlr.onGetFlow( flowId );
            returnJson( res, response );
        });
    }
}