import express from 'express';
import { NodeApi, NodeApiConfig } from './api/NodeApi';
import { NodeModel } from './models/node-model';

const nodeApi = new NodeApi( { memeber1: "1234"});

async function startup(){
    await nodeApi.start();
    console.log( "Started Node!");
}

startup();
