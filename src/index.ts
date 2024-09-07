#! /usr/bin/env node

import { connect, startServer } from './WS';

const arg = process.argv[2];
switch (arg) {
    case 'start':
        startServer();
        console.log('Server started!');
        break;

    case 'connect':
        connect();
        break;

    default:
        console.log('Available commands: start, connect');
        break;
}
