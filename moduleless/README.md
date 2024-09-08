# What's in this folder
I was just asking myself if it was possible to create a server and client WebSocket natively in Node.js.\
Anwser is yes, of course, but the complexity is obviously higher. Especially when it comes to decoding buffers.\
But I managed to get something.\
\
Server.ts is a small server that uses only Express and its sockets on req & res to accept WebSocket connections.
Client.ts is a client using the experimental WebSocket class of Node.js.\
