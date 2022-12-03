// express typescript socket.io
import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import * as path from "path";

export class Socket {
    private app: express.Application;
    private server: http.Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.server = http.createServer(this.app);
        this.io = socketio(this.server);
        this.listen();
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log("Running server on port %s", this.port);
        });

        this.io.on("connect", (socket: any) => {
            console.log("Connected client on port %s.", this.port);
            socket.on("message", (m: any) => {
                console.log("[server](message): %s", JSON.stringify(m));
                this.io.emit("message", m);
            });
            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
