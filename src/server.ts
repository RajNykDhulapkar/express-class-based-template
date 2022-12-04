import "dotenv/config";
import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import AuthenticationService from "./authentication/authentication.service";
import sessionModel from "./authentication/session.model";
import PostController from "./modules/post/post.controller";
import postModel from "./modules/post/post.model";
import PostService from "./modules/post/post.service";
import ReportController from "./modules/report/report.controller";
import UserController from "./modules/user/user.controller";
import userModel from "./modules/user/user.model";
import UserService from "./modules/user/user.service";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([
    new PostController(new PostService(postModel)),
    new AuthenticationController(new AuthenticationService(userModel, sessionModel)),
    new UserController(new UserService(userModel)),
    new ReportController(),
]);

app.listen();
