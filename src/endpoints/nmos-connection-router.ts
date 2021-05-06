// external imports
import express, { Response } from "express";

// controllers
import { IConnectionApiController } from "../controllers/i-connection-api-controller";

// Schemas converted from amwa github repo
import {
    BulkSenderResource,
    BulkActivationResponse,
    BulkReceiverResource,
    SenderResource,
    ReceiverResource,

    ConnectionAPIBaseResource,
    ConnectionAPISenderReceiverBaseResource,

    ConnectionAPIBulkBaseResource,

    ConnectionAPISingleBaseResource,
    ConnectionAPISingleSendersSenderIdBaseResource,
    ConnectionAPISingleReceiversReceiverIdBaseResource,

    Constraints,
    TransportType,
    TransportFile
} from "../schemas";

import { returnJson } from "../utils/return-nmos-json";



// The endpint for the nmos connection api according to amwa is-05
export class NmosConnectionRouter{

    public router;

    constructor(private connApiController: IConnectionApiController) {

        // Create express instance and register its endpoints
        this.router = express();
        this.registerEndpoints();
    }

    private registerEndpoints() {
        // create a shortcut to not call 'this.connApiController' every time
        const cntrlr = this.connApiController;

        this.router.get("/", (req, res) => {
            const returnVal: ConnectionAPIBaseResource = ["bulk/", "single/"];
            returnJson(res, returnVal);
        });

        this.router.get("/bulk/", (req, res) => {
            const bulkResponse: ConnectionAPIBulkBaseResource = ["receivers/", "senders/"];
            returnJson(res, bulkResponse);
        });

        this.router.get("/bulk/senders", (req, res: Response) => {
            res.sendStatus(405);
        });

        this.router.options("/bulk/senders", (req, res) => {
            res.sendStatus(200);
        });

        this.router.post("/bulk/senders", (req, res) => {
            const bulkSenderResource: BulkSenderResource = req.body;

            let response: BulkActivationResponse = cntrlr.onPostBulkSenders(bulkSenderResource);

            returnJson(res, response);
        });

        this.router.get("/bulk/receivers", (req, res) => {
            res.sendStatus(405);
        });

        this.router.options("/bulk/receivers", (req, res) => {
            res.sendStatus(200);
        });

        this.router.post("/bulk/receivers", (req, res) => {
            const bulkReceiverResource: BulkReceiverResource = req.body;
            let response: BulkActivationResponse = cntrlr.onPostBulkReceivers(bulkReceiverResource);
            returnJson(res, response);
        });

        this.router.get("/single/", (req, res) => {
            const response: ConnectionAPISingleBaseResource = ["senders/", "receivers/"];
            returnJson(res, response);
        });

        this.router.get("/single/senders/", (req, res) => {
            //const response: ConnectionAPISenderReceiverBaseResource = this.nodeApi.node.getAllSenderIds().map( el => el + "/");
            const response: ConnectionAPISenderReceiverBaseResource = cntrlr.onGetSenders();
            returnJson(res, response);
        });

        this.router.get("/single/senders/:id", (req, res) => {
            const response: ConnectionAPISingleSendersSenderIdBaseResource =
                ["constraints/", "staged/", "active/", "transportfile/", "transporttype/"];

            returnJson(res, response);
        });

        this.router.get("/single/senders/:id/constraints/", (req, res) => {
            const senderId = req.params.id;
            let response: Constraints = cntrlr.onGetSenderConstraints(senderId);
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getSender(req.params.id).getConstraints().getModel());
        });

        this.router.get("/single/senders/:id/staged/", (req, res) => {
            const senderId = req.params.id;
            let response: SenderResource = cntrlr.onGetSenderStaged(senderId);
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getSender(req.params.id).getStaged());
        });

        this.router.options("/single/senders/:id/staged/", (req, res) => {
            // returnJson(res, this.nodeApi.node.getSender(req.params.id).getStaged());
        });

        this.router.patch("/single/senders/:id/staged/", (req, res) => {
            const senderId = req.params.id;
            const updatedSender = req.body;
            const response: SenderResource = cntrlr.onPatchSenderStaged(senderId, updatedSender);
            // returnJson( res,  this.nodeApi.node.getSender( req.params.id ).getStaged() );
            returnJson(res, response);
        });

        this.router.get("/single/senders/:id/active/", (req, res) => {
            const senderId = req.params.id;
            const response: SenderResource = cntrlr.onGetSenderActive(senderId);
            returnJson(res, {});
        });

        this.router.get("/single/senders/:id/transportfile/", (req, res) => {
            const senderId = req.params.id;
            const response: TransportFile = cntrlr.onGetSenderTransportfile(senderId);
            res.send(response);
        });

        this.router.get("/single/senders/:id/transporttype/", (req, res) => {
            const senderId = req.params.id;
            const response: TransportType = cntrlr.onGetSenderTransporttype(senderId);
            returnJson(res, response);
        });

        this.router.get("/single/receivers/", (req, res) => {
            const response: ConnectionAPISenderReceiverBaseResource = cntrlr.onGetReceivers();
            returnJson(res, response);
            // returnJson( res, this.nodeApi.node.getAllReceiverIds().map( el => el + "/"))
        });

        this.router.get("/single/receivers/:id", (req, res) => {
            const receiverId = req.params.id;
            const response: ConnectionAPISingleReceiversReceiverIdBaseResource =
                ["constraints/", "staged/", "active/", "transporttype/"];

            returnJson(res, response);
        });

        this.router.get("/single/receivers/:id/constraints/", (req, res) => {
            const receiverId = req.params.id;
            const response: Constraints = cntrlr.onGetReceiverConstraints(receiverId);
            returnJson(res, response);
            // returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getConstraints().getModel());
        });

        this.router.get("/single/receivers/:id/staged/", (req, res) => {
            const receiverId = req.params.id;
            const response: ReceiverResource = cntrlr.onGetReceiverStaged(receiverId);
            returnJson(res, response);
            // returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getStaged());
        });

        this.router.options("/single/receivers/:id/staged/", (req, res) => {
            res.sendStatus(200);
        });

        this.router.patch("/single/receivers/:id/staged/", (req, res) => {
            const receiverId = req.params.id;
            const updatedReceiver = req.body;
            const response: ReceiverResource = cntrlr.onPatchReceiverStaged(receiverId, updatedReceiver);
            returnJson(res, response);
            //returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getStaged());
        });

        this.router.get("/single/receivers/:id/active/", (req, res) => {
            const receiverId = req.params.id;
            const response: ReceiverResource = cntrlr.onGetReceiverActive(receiverId);
            returnJson(res, response);
        });

        this.router.get("/single/receivers/:id/transporttype/", (req, res) => {
            const receiverId = req.params.id;
            const response: TransportType = cntrlr.onGetReceiverTransporttype(receiverId);
            returnJson(res, {});
        });
    }
}