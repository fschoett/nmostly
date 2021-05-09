// External imports
import express from "express";

import { NmosError } from "../resources/error";

// Import Controllers
import { IConnectionApiController } from "../controllers/i-connection-api-controller";
import { IDiscoveryApiController } from "../controllers/i-discovery-api-controller";

// Import SubRoute- Routers
import { NmosBaseRouter } from "./nmos-base-router";
import { NmosConnectionRouter } from "./nmos-connection-router";
import { NmosDiscoveryRouter } from "./nmos-discovery-router";



// Acts as the mediator of all http endpoints
export class CoreRouter{

    private router;

    constructor(
        private port: number,
        private nmosConnectionController: IConnectionApiController,
        private nmosDiscoveryController: IDiscoveryApiController
    ){

        // Setup endpoints
        this.router = express();
        this.router.use( express.json() )

        // Setup cors settings according to nmos specification
        this.router.use( this.nmosMiddlewareCors );

        // Start routing traffic
        this.registerSubRoutes();

        // Default 404
        this.router.use( this.nmosMiddlewareNotFound );
    }


    // Seperate method to start the express server, so it can be called
    // independently to module creation
    public startServer(){
        this.router.listen( this.port, () => {
            console.log( "CoreRouter: started http server.. Listening on Port: " , this.port );
        });
    }

    private registerSubRoutes(){
        const nmosBaseRouter = new NmosBaseRouter();
        const nmosDiscoveryRouter  = new NmosDiscoveryRouter(  this.nmosDiscoveryController );
        const nmosConnectionRouter = new NmosConnectionRouter( this.nmosConnectionController );


        // nmosBaseRouter
        this.router.use( "/", nmosBaseRouter.router );

        // nmosConnectionRouter
        this.router.use( "/x-nmos/node/v1.3/", nmosDiscoveryRouter.router );

        // nmosDiscoveryRouter
        this.router.use( "/x-nmos/connection/v1.1/", nmosConnectionRouter.router );
    }

    // 404 middleware
    private nmosMiddlewareNotFound(req, res, next) {
        res.status(404).send(new NmosError({
            code: 404,
            debug: "",
            error: "Not Found!"
        }));
    }

    // middleware cors
    private nmosMiddlewareCors(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, HEAD, OPTIONS, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
        res.header("Access-Control-Max-Age", "3600");

        if (req.method == 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    }
}