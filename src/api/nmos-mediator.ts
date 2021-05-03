import { ConnectionApiController } from "../controllers/connection-api-controller";
import { DiscoveryApiController } from "../controllers/discovery-api-controller";
import { CoreRouter } from "../endpoints/core-router";
import { Node } from "../resources/node";
import { INmosMediator } from "./i-nmos-mediator";

export class NmosMediator implements INmosMediator {

    private node: Node;
    private coreRouter: CoreRouter ;

    constructor( private port: number, node: Node ){
        this.node = node;

        this.setupEndpoints();
    }

    public startServer(){
        if( this.coreRouter ){
            this.coreRouter.startServer();
        }
    }

    private setupEndpoints(){
        const discoveryApiController  = new DiscoveryApiController(  this );
        const connectionApiController = new ConnectionApiController( this );
        
        this.coreRouter = new CoreRouter( 
            this.port,
            connectionApiController,
            discoveryApiController
        );
    }

    getNode(): Node {
        return this.node;
    }

    // think about setting up a store to prevent calling 
    // getNode().getResource().getModel()?

}