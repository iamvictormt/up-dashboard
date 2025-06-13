import { Post } from "./post";

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    }
    post: Post;
}