import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express()
const port: number = 3000;

app.get('/', function (req: Request, res: Response) {
    const magicString = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    const secWebSocketKey = req.headers['sec-websocket-key'];
    const concatenatedKey = secWebSocketKey + magicString;
    const sha1Hash = crypto.createHash('sha1');
    sha1Hash.update(concatenatedKey);
    const secWebSocketAccept = sha1Hash.digest('base64');

    const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${secWebSocketAccept}`
    ];

    if (!res.socket) {
        console.log('No res.socket');
        return;
    }

    res.socket.write(headers.join('\r\n') + '\r\n\r\n');

    req.socket.on('data', (data) => {
        const message = parseWebSocketFrame(data);
        console.log('Received:', message);

        // Echo the message back to the client
        const responseFrame = createWebSocketFrame(message);
        res.socket?.write(responseFrame);
    });

    req.socket.on('close', () => {
        console.log('WebSocket connection closed.');
    });
});


app.listen(port, async () => {
    console.log(`Server listening on port: ${port}`);
});

function parseWebSocketFrame(buffer: any) {
    const firstByte = buffer.readUInt8(0);
    const opCode = firstByte & 0xF;

    // We only support text frames for this example
    if (opCode !== 0x1) {
        return null;
    }

    const secondByte = buffer.readUInt8(1);
    const isMasked = Boolean((secondByte >>> 7) & 0x1);
    let currentOffset = 2;
    let payloadLength = secondByte & 0x7F;

    if (payloadLength > 125) {
        if (payloadLength === 126) {
            payloadLength = buffer.readUInt16BE(currentOffset);
            currentOffset += 2;
        } else {
            // 127
            // If this happens, the payload length is a 64-bit integer
            throw new Error('Large payloads not currently implemented');
        }
    }

    let maskingKey;
    if (isMasked) {
        maskingKey = buffer.slice(currentOffset, currentOffset + 4);
        currentOffset += 4;
    }

    const data = buffer.slice(currentOffset, currentOffset + payloadLength);
    if (isMasked) {
        for (let i = 0; i < data.length; i++) {
            data[i] ^= maskingKey[i % 4];
        }
    }

    return data.toString('utf8');
}

function createWebSocketFrame(data: any) {
    const payload = Buffer.from(data);
    const payloadLength = payload.length;

    let frameBuffer;

    if (payloadLength <= 125) {
        frameBuffer = Buffer.alloc(2 + payloadLength);
        frameBuffer.writeUInt8(0b10000001, 0);
        frameBuffer.writeUInt8(payloadLength, 1);
        payload.copy(frameBuffer, 2);
    } else if (payloadLength <= 65535) {
        frameBuffer = Buffer.alloc(4 + payloadLength);
        frameBuffer.writeUInt8(0b10000001, 0);
        frameBuffer.writeUInt8(126, 1);
        frameBuffer.writeUInt16BE(payloadLength, 2);
        payload.copy(frameBuffer, 4);
    } else {
        throw new Error('Large payloads not currently implemented');
    }

    return frameBuffer;
}
