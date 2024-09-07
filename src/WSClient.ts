import { WebSocket } from 'ws';
import CLI from './CLI';

export default class WSClient {
    private ws: WebSocket;
    private clientName: string;

    constructor(name?: string, url?: string) {
        const wsUrl = url ? url : 'ws://localhost:8080';
        const ws = new WebSocket(wsUrl);
        ws.on('error', console.error);

        let clientName;
        if (name) clientName = name;
        else clientName = 'client'

        this.ws = ws;
        this.clientName = clientName;
    }

    connect() {
        const cli = new CLI(this.clientName);

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
}
