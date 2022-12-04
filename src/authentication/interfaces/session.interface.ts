import mongoose from "mongoose";
import User from "src/modules/user/user.interface";

interface Session {
    _id: string;
    valid: Boolean;
    user: User["_id"];
    createdAt: Date;
}

export default Session;
