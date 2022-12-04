import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import TokenData from "../interfaces/tokenData.interface";
import CreateUserDto from "../modules/user/dtos/user.dto";
import User from "../modules/user/user.interface";
import { UserModelMongoose as UserModel } from "../modules/user/user.model";
import { SessionModelMongoose as SessionModel } from "./session.model";

export interface IAuthenticationService {
    user: UserModel;
    session: SessionModel;
    register(userData: CreateUserDto): Promise<{
        cookie: string;
        user: User & mongoose.Document;
    }>;
    createCookie(tokenData: TokenData): string;
    createToken(user: User): TokenData;
}

class AuthenticationService implements IAuthenticationService {
    public user: UserModel;
    public session: SessionModel;

    constructor(
        private readonly _userModel: UserModel,
        private readonly _sessionModel: SessionModel,
    ) {}

    public async register(userData: CreateUserDto) {
        if (await this.user.findOne({ email: userData.email })) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create({
            ...userData,
            password: hashedPassword,
        });
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }
    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}

export default AuthenticationService;
