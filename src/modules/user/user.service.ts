import mongoose from "mongoose";
import Service from "src/interfaces/service.interface";
import CreateUserDto from "./dtos/user.dto";
import User from "./user.interface";
import { UserModelMongoose as UserModel } from "./user.model";

export interface IUserService extends Service<User> {
    getById(userId: any): Promise<User>;
    getByEmail(email: string): Promise<User>;
    getByPhone(phone: string): Promise<User>;
}

class UserService implements IUserService {
    public userModel: UserModel;
    constructor(private readonly _userModel: UserModel) {
        this.userModel = _userModel;
    }

    public async getAll(): Promise<User[]> {
        return this.userModel.find().select("-password");
    }

    public async getById(postId: mongoose.ObjectId): Promise<User> {
        return this.userModel.findById(postId).select("-password");
    }

    public async getByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).select("-password");
    }
    public async getByPhone(phone: string): Promise<User> {
        return this.userModel.findOne({ phone }).select("-password");
    }

    public async create(userData: CreateUserDto): Promise<User> {
        const createdPost = new this.userModel(userData);
        const savedPost = await createdPost.save();
        return savedPost.populate("-password");
    }

    public async update(userId: mongoose.ObjectId, userData: CreateUserDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(userId, userData, { new: true });
    }

    public async delete(userId: mongoose.ObjectId): Promise<User> {
        const post = await this.userModel.findByIdAndDelete(userId);
        return post;
    }
}

export default UserService;
