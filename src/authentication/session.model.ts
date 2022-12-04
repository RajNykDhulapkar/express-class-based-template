import mongoose from "mongoose";
import Session from "./interfaces/session.interface";

const sessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        valid: { type: Boolean, default: true },
        userAgent: { type: String },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

const sessionModel = mongoose.model<Session & mongoose.Document>("Session", sessionSchema);

export type SessionModelMongoose = mongoose.Model<Session & mongoose.Document>;

export default sessionModel;
