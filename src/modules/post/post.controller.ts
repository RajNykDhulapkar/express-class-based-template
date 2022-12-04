import { Request, Response, NextFunction, Router } from "express";
import mongoose from "mongoose";
import PostNotFoundException from "../../exceptions/PostNotFoundException";
import Controller from "../../interfaces/controller.interface";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import CreatePostDto from "./dtos/post.dto";
import Post from "./interfaces/post.interface";
import postModel from "./post.model";
import PostService, { IPostService } from "./post.service";

class PostController implements Controller {
    public path = "/api/post";
    public router = Router();
    private post = postModel;
    private readonly postService: IPostService;

    constructor(private readonly _postService: IPostService) {
        this.postService = _postService;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    private getAllPosts = async (request: Request, response: Response) => {
        const posts = await this.postService.getAll();
        response.send(posts);
    };

    private getPostById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const post = await this.postService.getById(id);
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    };

    private modifyPost = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const postData: Post = request.body;
        const post = await this.postService.update(id, postData);
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    };

    private createPost = async (request: RequestWithUser, response: Response) => {
        const postData: CreatePostDto = request.body;
        const authorId = request.user._id;
        const createdPost = await this.postService.create(postData, authorId);
        response.send(createdPost);
    };

    private deletePost = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.post.findByIdAndDelete(id);
        if (successResponse) {
            response.send(200);
        } else {
            next(new PostNotFoundException(id));
        }
    };
}

export default PostController;
