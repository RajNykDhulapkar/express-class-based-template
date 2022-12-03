import { Request } from "express";
import { Server } from "socket.io";

interface RequestWithIO extends Request {
    io: Server;
}

export default RequestWithIO;
