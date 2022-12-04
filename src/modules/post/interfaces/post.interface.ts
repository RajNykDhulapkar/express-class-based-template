import mongoose from "mongoose";

interface Post {
    authorId: string;
    content: string;
    title: string;
}

export default Post;

export type PostModelMongoose = mongoose.Model<Post & mongoose.Document>;
