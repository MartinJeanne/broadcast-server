import http from 'http';
import crypto from 'crypto';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
});

server.on('upgrade', (req, socket, head) => {
    if (req.headers['upgrade'] !== 'websocket') {
        socket.end('HTTP/1.1 400 Bad Request');
        return;
    }

    // WebSocket handshake
    const acceptKey = req.headers['sec-websocket-key'];
    const hash = generateAcceptValue(acceptKey);
    const responseHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${hash}`
    ];

    socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

    // WebSocket connection handler
    socket.on('data', (buffer) => {
        const message = parseWebSocketFrame(buffer);
        console.log('Received:', message);

        // Echo the message back to the client
        const responseFrame = createWebSocketFrame(message);
        socket.write(responseFrame);
    });
});

function generateAcceptValue(acceptKey: string | undefined) {
    return crypto
        .createHash('sha1')
        .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
        .digest('base64');
}

function parseWebSocketFrame(buffer: any) {
    const firstByte = buffer.readUInt8(0);
    const isFinalFrame = Boolean((firstByte >>> 7) & 0x1);
    const [reserved1, reserved2, reserved3] = [
        Boolean((firstByte >>> 6) & 0x1),
        Boolean((firstByte >>> 5) & 0x1),
        Boolean((firstByte >>> 4) & 0x1)
    ];
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

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`WebSocket server is listening on port ${PORT}`);
});