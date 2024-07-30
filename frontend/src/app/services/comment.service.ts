import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comments.models';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    private apiUrl = 'http://181.162.53.94:8080/api/avisos';

    constructor(private http: HttpClient) { }

    createComment(avisoId: string, comment: Partial<Comment>, token: string): Observable<Comment> {
        return this.http.post<Comment>(`${this.apiUrl}/${avisoId}/comments`, comment, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        });
    }

    getCommentsByAvisoId(avisoId: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/${avisoId}/comments`);
    }

    updateComment(avisoId: string, commentId: string, content: string, token: string): Observable<Comment> {
        return this.http.put<Comment>(`${this.apiUrl}/${avisoId}/comments/${commentId}`, { content }, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        });
    }

    deleteComment(avisoId: string, commentId: string, token: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${avisoId}/comments/${commentId}`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        });
    }
}
