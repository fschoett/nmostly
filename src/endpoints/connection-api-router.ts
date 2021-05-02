import express, { Response } from "express";
import { NodeApi } from "../api/node-api";
import { IConnectionApiController } from "../controllers/i-connection-api-controller";

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


export class RouterNmosApiConnection {

    private _router;

    constructor(private nodeApi: NodeApi, private connApiController: IConnectionApiController) {
        this._router = express();
        this.registerEndpoints();
    }

    get router() { return this._router }


    private registerEndpoints() {
        const connectionApiRouter = this.router;
        const cntrlr = this.connApiController;

        connectionApiRouter.get("/", (req, res) => {
            const returnVal: ConnectionAPIBaseResource = ["bulk/", "single/"];
            returnJson(res, returnVal);
        });

        connectionApiRouter.get("/bulk/", (req, res) => {
            const bulkResponse: ConnectionAPIBulkBaseResource = ["receivers/", "senders/"];
            returnJson(res, bulkResponse);
        });

        connectionApiRouter.get("/bulk/senders", (req, res: Response) => {
            res.sendStatus(405);
        });

        connectionApiRouter.options("/bulk/senders", (req, res) => {
            res.sendStatus(200);
        });

        connectionApiRouter.post("/bulk/senders", (req, res) => {
            const bulkSenderResource: BulkSenderResource = req.body;

            let response: BulkActivationResponse[] = cntrlr.onPostBulkSenders(bulkSenderResource);

            returnJson(res, response);
        });

        connectionApiRouter.get("/bulk/receivers", (req, res) => {
            res.sendStatus(405);
        });

        connectionApiRouter.options("/bulk/receivers", (req, res) => {
            res.sendStatus(200);
        });

        connectionApiRouter.post("/bulk/receivers", (req, res) => {
            const bulkReceiverResource: BulkReceiverResource = req.body;
            let response: BulkActivationResponse[] = cntrlr.onPostBulkReceivers(bulkReceiverResource);
            returnJson(res, response);
        });

        connectionApiRouter.get("/single/", (req, res) => {
            const response: ConnectionAPISingleBaseResource = ["senders/", "receivers/"];
            returnJson(res, response);
        });

        connectionApiRouter.get("/single/senders/", (req, res) => {
            //const response: ConnectionAPISenderReceiverBaseResource = this.nodeApi.node.getAllSenderIds().map( el => el + "/");
            const response: ConnectionAPISenderReceiverBaseResource = cntrlr.onGetSenders();
            returnJson(res, response);
        });

        connectionApiRouter.get("/single/senders/:id", (req, res) => {
            const response: ConnectionAPISingleSendersSenderIdBaseResource =
                ["constraints/", "staged/", "active/", "transportfile/", "transporttype/"];

            returnJson(res, response);
        });

        connectionApiRouter.get("/single/senders/:id/constraints/", (req, res) => {
            const senderId = req.params.id;
            let response: Constraints = cntrlr.onGetSenderConstraints(senderId);
            returnJson(res, this.nodeApi.node.getSender(req.params.id).getConstraints().getModel());
        });

        connectionApiRouter.get("/single/senders/:id/staged/", (req, res) => {
            const senderId = req.params.id;
            let response: SenderResource = cntrlr.onGetSenderStaged(senderId);
            returnJson(res, this.nodeApi.node.getSender(req.params.id).getStaged());
        });

        connectionApiRouter.options("/single/senders/:id/staged/", (req, res) => {
            returnJson(res, this.nodeApi.node.getSender(req.params.id).getStaged());
        });

        connectionApiRouter.patch("/single/senders/:id/staged/", (req, res) => {
            const senderId = req.params.id;
            const updatedSender = req.body;
            const response: SenderResource = cntrlr.onPatchSenderStaged(senderId, updatedSender );
            // returnJson( res,  this.nodeApi.node.getSender( req.params.id ).getStaged() );
            returnJson(res, response);
        });

        connectionApiRouter.get("/single/senders/:id/active/", (req, res) => {
            const senderId = req.params.id;
            const response: SenderResource = cntrlr.onGetSenderActive(senderId);
            returnJson(res, {});
        });

        connectionApiRouter.get("/single/senders/:id/transportfile/", (req, res) => {
            const senderId = req.params.id;
            const response: TransportFile = cntrlr.onGetSenderTransportfile(senderId);
            res.send(response);
        });

        connectionApiRouter.get("/single/senders/:id/transporttype/", (req, res) => {
            const senderId = req.params.id;
            const response: TransportType = cntrlr.onGetSenderTransporttype(senderId);
            returnJson(res, response);
        });

        connectionApiRouter.get("/single/receivers/", (req, res) => {
            const response: ConnectionAPISenderReceiverBaseResource = cntrlr.onGetReceivers();
            returnJson(res, response);
            // returnJson( res, this.nodeApi.node.getAllReceiverIds().map( el => el + "/"))
        });

        connectionApiRouter.get("/single/receivers/:id", (req, res) => {
            const receiverId = req.params.id;
            const response: ConnectionAPISingleReceiversReceiverIdBaseResource =
                ["constraints/", "staged/", "active/", "transporttype/"];

            returnJson(res, response );
        });

        connectionApiRouter.get("/single/receivers/:id/constraints/", (req, res) => {
            const receiverId = req.params.id;
            const response: Constraints = cntrlr.onGetReceiverConstraints( receiverId );
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getConstraints().getModel());
        });

        connectionApiRouter.get("/single/receivers/:id/staged/", (req, res) => {
            const receiverId = req.params.id;
            const response: ReceiverResource = cntrlr.onGetReceiverStaged( receiverId );
            returnJson( res, response );
            // returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getStaged());
        });

        connectionApiRouter.options("/single/receivers/:id/staged/", (req, res) => {
            res.sendStatus( 200 );
        });

        connectionApiRouter.patch("/single/receivers/:id/staged/", (req, res) => {
            const receiverId = req.params.id;
            const updatedReceiver = req.body;
            const response: ReceiverResource = cntrlr.onPatchReceiverStaged( receiverId, updatedReceiver );
            returnJson( res, response );
            //returnJson(res, this.nodeApi.node.getReceiver(req.params.id).getStaged());
        });

        connectionApiRouter.get("/single/receivers/:id/active/", (req, res) => {
            const receiverId = req.params.id;
            const response: ReceiverResource = cntrlr.onGetReceiverActive( receiverId );
            returnJson(res, response );
        });

        connectionApiRouter.get("/single/receivers/:id/transporttype/", (req, res) => {
            const receiverId = req.params.id;
            const response: TransportType = cntrlr.onGetReceiverTransporttype( receiverId );
            returnJson(res, {});
        });
    }
}