import express from "express";
import { NodeApi } from "../api/node-api";
import { returnJson } from "../utils/return-nmos-json";


export class RouterNmosApiConnection{

    private _router;

    constructor( private nodeApi: NodeApi ){
        this._router = express();
        this.registerEndpoints();
    }

    get router() { return this._router }


    private registerEndpoints(){
        const connectionApiRouter = this.router;
        connectionApiRouter.get( "/", (req, res) => {
            returnJson( res, ["bulk/", "single/"]);
        });

        connectionApiRouter.get( "/single/", (req, res) => {
            returnJson( res, ["senders/", "receivers/"]);
        });

        connectionApiRouter.get( "/single/senders/", (req, res) => {
            returnJson( res, this.nodeApi.node.getAllSenderIds().map( el => el + "/"))
        });

        connectionApiRouter.get( "/single/senders/:id", (req, res) => {
            returnJson( res, ["constraints/", "staged/", "active/", "transportfile/", "transporttype/"] );
        });

        connectionApiRouter.get( "/single/senders/:id/constraints/", (req, res) => {
            returnJson( res,  {});
        });
        connectionApiRouter.get( "/single/senders/:id/staged/", (req, res) => {
            returnJson( res,  {});
        });
        connectionApiRouter.get( "/single/senders/:id/active/", (req, res) => {
            returnJson( res,  {});
        });
        connectionApiRouter.get( "/single/senders/:id/transportfile/", (req, res) => {
            returnJson( res,  {});
        });
        connectionApiRouter.get( "/single/senders/:id/transporttype/", (req, res) => {
            returnJson( res,  {});
        });

        connectionApiRouter.get( "/single/receivers/", (req, res) => {
            returnJson( res, this.nodeApi.node.getAllReceiverIds().map( el => el + "/"))
        });

        connectionApiRouter.get( "/single/receivers/:id", (req, res) => {
            returnJson( res, ["constraints/", "staged/", "active/", "transporttype/"] );
        });
        connectionApiRouter.get( "/single/receivers/:id/constraints/", (req, res) => {
            returnJson( res,  {});
        });
        connectionApiRouter.get( "/single/receivers/:id/staged/", (req, res) => {
            returnJson( res,  {});
        });
        connectionApiRouter.get( "/single/receivers/:id/active/", (req, res) => {
            returnJson( res,  {});
        });
        connectionApiRouter.get( "/single/receivers/:id/transporttype/", (req, res) => {
            returnJson( res,  {});
        });
    }
}