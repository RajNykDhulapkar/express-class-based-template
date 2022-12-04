import mongoose from "mongoose";
import Service from "src/interfaces/service.interface";
import CreatePostDto from "./dtos/post.dto";
import Post, { PostModelMongoose as PostModel } from "./interfaces/post.interface";

export interface IPostService extends Omit<Service<Post>, "create"> {
    postModel: PostModel;
    create(postData: CreatePostDto, authorId: any): Promise<Post>;
}

class PostService implements IPostService {
    public postModel: PostModel;
    constructor(private readonly _postModel: PostModel) {
        this.postModel = _postModel;
    }

    public async getAll(): Promise<Post[]> {
        return this.postModel.find().populate("author", "-password");
    }

    public async getById(postId: mongoose.ObjectId): Promise<Post> {
        return this.postModel.findById(postId);
    }

    public async create(postData: CreatePostDto, authorId: mongoose.ObjectId): Promise<Post> {
        const createdPost = new this.postModel({
            ...postData,
            author: authorId,
        });
        const savedPost = await createdPost.save();
        return savedPost.populate("author", "-password");
    }

    public async update(postId: mongoose.ObjectId, postData: CreatePostDto): Promise<Post> {
        return this.postModel.findByIdAndUpdate(postId, postData, { new: true });
    }

    public async delete(postId: mongoose.ObjectId): Promise<Post> {
        const post = await this.postModel.findByIdAndDelete(postId);
        return post;
    }
}

export default PostService;
