import { NodeApi } from './api/NodeApi';
import { IDeviceModelConfig } from './models/Interfaces/i-device-model';
import { IFlowModelConfig } from './models/Interfaces/i-flow-model';
import { ISenderModelConfig } from './models/Interfaces/i-sender-model';
import { ISourceModel, ISourceModelConfig } from './models/Interfaces/i-source-model';


class Tmp{ 
    test: string;
    private otherVar : string;
    
    constructor( test: string, otherVar: string ){
        this.test = test;
        this.otherVar = otherVar;
    }

    public printMsg(){
        console.log("Hi my test is : ", this.test, this.otherVar);
        
    }
}

let tmp = new Tmp( "test", "otherVar");
tmp.printMsg();

console.log( "Stringified Tmp class: ", JSON.stringify( tmp ));


const nodeApi = new NodeApi( { memeber1: "1234"});

const newDevice: IDeviceModelConfig = {
    label : "New Label"
};

const newDeviceId = nodeApi.addDevice( newDevice );

const newSource: ISourceModelConfig = {
    description : "This is the first ever source registered in the whole thing",
    label: "First Source",
    device_id: newDeviceId
}




// const newSender: ISenderModelConfig = {
    //description: "This is a nice sender! Lets see whats going on in here!",
    //label : "NewSenderLabel"
//};

const newSourceId = nodeApi.addSource( newSource );

const newFlow : IFlowModelConfig ={
    description: "New Flow For new source",
    label: "flow/1",
    source_id: newSourceId

}



// nodeApi.addSender( newDeviceId, newSender );

async function startup(){
    await nodeApi.start();
    console.log( "Started Node!");
}

startup();
