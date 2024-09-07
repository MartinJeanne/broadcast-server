# broadcast-server

## Info
A CLI that allow you to start a small WebSocket server, or to connect to one!\
This project idea comes from [Roadmap.sh](https://roadmap.sh/projects/broadcast-server)

## Run
With Node.js on your computer, clone the project and execute these commands:
```bash
npm i
```

```bash
npm run build
```

```bash
npm link
```

Later, if you want to unlink it:
```bash
npm unlink --global
```

## How to use
Two commands are available:
```bash
broadcast-server start`
```

```bash
broadcast-server connect
```

### Server
Execute `broadcast-server start` and a WebSocket Server will be listening on your localhost port 8080.\
If you wishes to change the port, you can do: `broadcast-server start 8000`

### Client
Execute `broadcast-server connect` to connect to a listenning WebSocket server on localhopst port 8080.\
If you wishes to change the connection url, you can do: `broadcast-server connect ws://your-server:8000`
