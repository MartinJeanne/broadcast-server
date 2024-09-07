import { WebSocket } from 'ws';
import CLI from './CLI';

export default function connectClient(ws: WebSocket) {
    ws.on('error', console.error);

    const cli = new CLI();
    ws.on('open', function open() {
        cli.listen();
        cli.onLineListener(line => ws.send(line));
        cli.onCloseListener(() => console.log('\nHave a great day!'));
    });

    ws.on('message', function message(data) {
        console.log('received: %s', data);
        cli.listen();
    });
}
