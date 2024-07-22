import { Component, OnInit } from '@angular/core';
import { AvisosService } from 'src/app/services/avisos.service';
import { CommentsService } from 'src/app/services/comment.service';
import { ReactionsService } from 'src/app/services/reactions.service';
import { AuthService } from 'src/app/services/auth.service';
import { Aviso } from 'src/app/models/avisos.models';
import { Comment } from 'src/app/models/comments.models';

@Component({
  selector: 'app-avisos-list',
  templateUrl: './avisos-list.component.html',
  styleUrls: ['./avisos-list.component.css']
})
export class AvisosListComponent implements OnInit {
  avisos: Aviso[] = [];
  newComments: { [key: string]: string } = {};

  constructor(
    private avisosService: AvisosService,
    private commentsService: CommentsService,
    private reactionsService: ReactionsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAvisos();
  }

  loadAvisos(): void {
    this.avisosService.getAvisos().subscribe((data: Aviso[]) => {
      this.avisos = data.map(aviso => {
        if (!aviso.reactions) {
          aviso.reactions = { likes: 0, dislikes: 0 };
        }
        if (!aviso.comments) {
          aviso.comments = [];
        }
        return aviso;
      });
    }, error => {
      console.error('Error fetching avisos', error);
    });
  }

  addComment(avisoId: string): void {
    const content = this.newComments[avisoId];
    const token = this.authService.getToken();
    if (token && content) {
      this.commentsService.createComment(avisoId, { content }, token).subscribe(comment => {
        const aviso = this.avisos.find(a => a._id === avisoId);
        if (aviso && aviso.comments) {
          aviso.comments.push(comment);
        }
        this.newComments[avisoId] = '';
      }, error => {
        console.error('Error adding comment', error);
      });
    } else {
      console.error('No token found or comment content is empty. Please log in and enter a comment.');
    }
  }

  deleteComment(avisoId: string, commentId: string): void {
    const token = this.authService.getToken();
    if (token) {
      this.commentsService.deleteComment(avisoId, commentId, token).subscribe(() => {
        const aviso = this.avisos.find(a => a._id === avisoId);
        if (aviso && aviso.comments) {
          aviso.comments = aviso.comments.filter(comment => comment._id !== commentId);
        }
      }, error => {
        console.error('Error deleting comment', error);
      });
    } else {
      console.error('No token found. Please log in.');
    }
  }

  likeAviso(avisoId: string): void {
    const token = this.authService.getToken();
    if (token) {
      this.reactionsService.likePost(avisoId, token).subscribe(() => {
        const aviso = this.avisos.find(a => a._id === avisoId);
        if (aviso && aviso.reactions) {
          aviso.reactions.likes++;
        } else if (aviso) {
          aviso.reactions = { likes: 1, dislikes: 0 };
        }
      }, error => {
        console.error('Error liking post', error);
      });
    } else {
      console.error('No token found. Please log in.');
    }
  }

  dislikeAviso(avisoId: string): void {
    const token = this.authService.getToken();
    if (token) {
      this.reactionsService.dislikePost(avisoId, token).subscribe(() => {
        const aviso = this.avisos.find(a => a._id === avisoId);
        if (aviso && aviso.reactions) {
          aviso.reactions.dislikes++;
        } else if (aviso) {
          aviso.reactions = { likes: 0, dislikes: 1 };
        }
      }, error => {
        console.error('Error disliking post', error);
      });
    } else {
      console.error('No token found. Please log in.');
    }
  }

  deleteAviso(id?: string): void {
    if (id) {
      this.avisosService.deleteAviso(id).subscribe(() => {
        this.loadAvisos();
      }, error => {
        console.error('Error deleting aviso', error);
      });
    } else {
      console.error('Aviso ID is undefined');
    }
  }
}
