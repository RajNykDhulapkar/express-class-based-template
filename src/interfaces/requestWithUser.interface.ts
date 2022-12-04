import { Request } from "express";
import User from "../modules/user/user.interface";
import RequestWithIO from "./requestWithIO.interface";

interface RequestWithUser extends RequestWithIO {
    user: User;
}

export default RequestWithUser;
