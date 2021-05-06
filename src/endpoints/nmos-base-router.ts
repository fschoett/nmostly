import express from "express";
import { returnJson } from "../utils/return-nmos-json";


export class NmosBaseRouter{

    public router;

    constructor() {
        this.router = express();

        // According to amwa nmos is-04
        this.router.get("/", (req, res) => { returnJson(res, ["x-nmos/"]) });
        this.router.get("/x-nmos/", (req, res) => { returnJson(res, ["node/", "connection/"]) });

        // according to is-04 respective is-05
        this.router.get("/x-nmos/node/", (req, res) => { returnJson(res, ["v1.3/"]) });
        this.router.get("/x-nmos/connection/", (req, res) => { returnJson(res, ["v1.1/"]) });
    }

}