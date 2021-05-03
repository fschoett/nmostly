import { Node } from "../resources/node";
import { INmosMediator } from "./i-nmos-mediator";

export class NmosMediator implements INmosMediator {

    private node: Node;

    constructor( node: Node ){
        this.node = node;
    }

    getNode(): Node {
        return this.node;
    }

}