import readline from 'node:readline';

export default class CLI {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'client: ',
        });
    }

    listen() {
        this.rl.prompt();
    }

    onLineListener(callback: (line: string) => void) {
        this.rl.on('line', async (line: string) => {
            callback(line);
            this.rl.prompt();
        });
    }

    onCloseListener(callback: () => void) {
        this.rl.on('close', () => {
            callback();
            process.exit(0);
        });
    }
}
