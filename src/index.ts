#! /usr/bin/env node

import WSClient from './WSClient';
import WSServer from './WSServer';

const arg = process.argv[2];
const host = process.argv[3];
let server: WSServer | null;
let client: WSClient | null;

switch (arg) {
    case 'start':
        server = new WSServer();
        server.start();
        console.log('Server started!');
        break;

    case 'connect':
        client = new WSClient(host);
        client.connect();
        break;

    default:
        console.log('Available commands: start, connect');
        break;
}

process.on('SIGINT', handleStop);
process.on('SIGTERM', handleStop);

function handleStop() {
    console.info('Gracefully stopping the server');
    if (server) server.stop();
    if (client) client.stop();
    process.exit(0);
};
