import { Comment } from './comments.models';

export interface Aviso {
    _id: string;
    title: string;
    description: string;
    author: string;
    comments?: Comment[];
    reactions: {
        likes: number;
        dislikes: number;
        likedBy: string[];
        dislikedBy: string[];
    };
    createdAt?: Date;
    updatedAt?: Date;
}
