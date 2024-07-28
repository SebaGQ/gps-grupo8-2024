
import { Comment } from './comments.models';
import { UserDTO } from '../dto/user.dto';

export interface Aviso {
    _id: string;
    title: string;
    description: string;
    author: UserDTO;
    reactions: {
        likes: number;
        dislikes: number;
        likedBy: string[];
        dislikedBy: string[];
    };
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
}
