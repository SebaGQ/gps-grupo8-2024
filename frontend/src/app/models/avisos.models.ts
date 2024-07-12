export interface Aviso {
    _id?: string;
    title: string;
    description: string;
    author: string;
    coments?: string[];
    reactions?:
    {
        like: number;
        dislike: number;
    };
    createdAt?: Date;
    updatedAt?: Date;

}