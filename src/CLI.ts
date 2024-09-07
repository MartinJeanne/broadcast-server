import readline from 'node:readline';

export default class CLI {
    private rl: readline.Interface;
    private promptName: string;

    constructor(name: string) {
        this.promptName = name;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
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
