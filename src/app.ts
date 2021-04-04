import express from 'express';
import { NodeApi, NodeApiConfig } from './api/NodeApi';
import { NodeModel } from './models/node-model';

const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.send("Hello World!");

});


app.listen(port, async () => {

    const nodeApi = new NodeApi({memeber1 : "234"});
    await nodeApi.start();
    return console.log('server ist listening on port ', port);

});