#! /usr/bin/env node

import WSClient from './WSClient';
import WSServer from './WSServer';

const arg = process.argv[2];
switch (arg) {
    case 'start':
        const server = new WSServer();
        server.start();
        console.log('Server started!');
        break;

    case 'connect':
        const client = new WSClient();
        client.connect();
        break;

    default:
        console.log('Available commands: start, connect');
        break;
}
