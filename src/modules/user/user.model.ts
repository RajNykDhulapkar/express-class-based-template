import * as mongoose from "mongoose";
import User from "./user.interface";
import * as bcrypt from "bcrypt";

const addressSchema = new mongoose.Schema({
    city: String,
    country: String,
    street: String,
});

export interface UserDocument extends mongoose.Document, User {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
    {
        address: addressSchema,
        email: {
            type: String,
            unique: true,
        },
        phone: {
            type: String,
            unique: true,
        },
        firstName: String,
        lastName: String,
        isEmailConfirmed: {
            type: Boolean,
            default: false,
        },
        isPhoneConfirmed: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            get: (): undefined => undefined,
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        timestamps: true,
    },
);

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "author",
});

userSchema.index({ email: 1, phone: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
    let user = this;

    if (!user.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as User & mongoose.Document;

    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export type UserModelMongoose = mongoose.Model<User & mongoose.Document>;

export default userModel;
