import { WebSocket } from 'ws';
import CLI from './CLI';

export default class WSClient {
    private ws: WebSocket;

    constructor(url?: string) {
        const wsUrl = url ? url : 'ws://localhost:8080';
        const ws = new WebSocket(wsUrl);
        ws.on('error', console.error);
        this.ws = ws;
    }

    connect() {
        const cli = new CLI();

        this.ws.on('open', () => {
            cli.onLineListener(line => this.ws.send(line));
            cli.onCloseListener(() => console.log('\nHave a great day!'));
            cli.listen();
        });

        this.ws.on('message', data => {
            console.log(data.toString());
            cli.listen();
        });
    }

    stop() {
        this.ws.close();
    }
}
