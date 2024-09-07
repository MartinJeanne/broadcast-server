#! /usr/bin/env node

import { connectToWebSocketServer, startWebSocketServer } from './WS';

const arg = process.argv[2];
switch (arg) {
    case 'start':
        startWebSocketServer();
        console.log('Server started!');
        break;

    case 'connect':
        connectToWebSocketServer();
        break;

    default:
        console.log('Available commands: start, connect');
        break;
}
