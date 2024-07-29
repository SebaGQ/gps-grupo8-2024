import { UserDTO } from '../dto/user.dto';

export interface Comment {
    _id: string;
    aviso: string;
    author: UserDTO;
    content: string;
    createdAt: Date;
    // Otros campos que consideres necesarios
}
