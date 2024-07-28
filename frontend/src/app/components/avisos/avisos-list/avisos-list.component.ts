// Importaciones necesarias
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AvisosService } from 'src/app/services/avisos.service';
import { CommentsService } from 'src/app/services/comment.service';
import { ReactionsService } from 'src/app/services/reactions.service';
import { AuthService } from 'src/app/services/auth.service';
import { Aviso } from 'src/app/models/avisos.models';
import { Router } from '@angular/router';
import { Comment } from 'src/app/models/comments.models';

@Component({
  selector: 'app-avisos-list',
  templateUrl: './avisos-list.component.html',
  styleUrls: ['./avisos-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AvisosListComponent implements OnInit {
  avisos: Aviso[] = [];
  newComments: { [key: string]: string } = {};
  showComments: { [key: string]: boolean } = {};
  userRole: string | null = null;
  userId: string = '';
  currentUserId: string = '';
  isProcessing: { [key: string]: boolean } = {};
  editingComment: { [key: string]: boolean } = {};
  commentBeingEdited: Comment | null = null;
  editingCommentId: string | null = null;

  constructor(
    private avisosService: AvisosService,
    private commentsService: CommentsService,
    private reactionsService: ReactionsService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.userId = this.authService.getUserId() || '';
    this.currentUserId = this.authService.getUserId() || '';
    this.loadAvisos();
  }

  loadAvisos(): void {
    this.avisosService.getAvisos().subscribe((data: Aviso[]) => {
      this.avisos = data.map(aviso => {
        if (!aviso.reactions) {
          aviso.reactions = { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] };
        }
        if (!aviso.comments) {
          aviso.comments = [];
        }
        return aviso;
      });
      this.cdr.markForCheck(); // Marca para la detección de cambios
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
          aviso.comments.push(comment); // Actualiza el comentario con todos los datos
          this.cdr.markForCheck(); // Marca para la detección de cambios
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
        this.cdr.markForCheck(); // Marca para la detección de cambios
      }, error => {
        console.error('Error deleting comment', error);
      });
    } else {
      console.error('No token found. Please log in.');
    }
  }

  toggleReaction(avisoId: string, reactionType: 'like' | 'dislike'): void {
    const token = this.authService.getToken();
    if (token && this.userId) {
      // Actualización optimista
      const index = this.avisos.findIndex(a => a._id === avisoId);
      if (index !== -1) {
        const aviso = { ...this.avisos[index] }; // Copia superficial

        if (!aviso.reactions) {
          aviso.reactions = { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] };
        }

        const currentReaction = reactionType === 'like' ? 'likedBy' : 'dislikedBy';
        const oppositeReaction = reactionType === 'like' ? 'dislikedBy' : 'likedBy';

        if (aviso.reactions[currentReaction].includes(this.userId)) {
          aviso.reactions[reactionType === 'like' ? 'likes' : 'dislikes'] -= 1;
          aviso.reactions[currentReaction] = aviso.reactions[currentReaction].filter((id: string) => id !== this.userId);
        } else {
          aviso.reactions[reactionType === 'like' ? 'likes' : 'dislikes'] += 1;
          aviso.reactions[currentReaction].push(this.userId);
          if (aviso.reactions[oppositeReaction].includes(this.userId)) {
            aviso.reactions[reactionType === 'like' ? 'dislikes' : 'likes'] -= 1;
            aviso.reactions[oppositeReaction] = aviso.reactions[oppositeReaction].filter((id: string) => id !== this.userId);
          }
        }

        this.avisos[index] = aviso;
        this.cdr.markForCheck(); // Marca para detección de cambios
      }

      // Llamada al servidor
      this.reactionsService.reactToAviso(avisoId, reactionType, token).subscribe(
        (updatedAviso) => {
          const index = this.avisos.findIndex(a => a._id === avisoId);
          if (index !== -1) {
            this.avisos[index] = {
              ...this.avisos[index],
              reactions: {
                likes: updatedAviso.reactions.likes,
                dislikes: updatedAviso.reactions.dislikes,
                likedBy: updatedAviso.reactions.likedBy,
                dislikedBy: updatedAviso.reactions.dislikedBy
              }
            };
            this.cdr.markForCheck(); // Marca para detección de cambios
          }
          this.isProcessing[avisoId] = false;
        },
        (error) => {
          console.error(`Error reacting to aviso`, error);
          // Revertir la actualización optimista en caso de error
          this.loadAvisos();
          this.isProcessing[avisoId] = false;
          this.cdr.markForCheck(); // Marca para detección de cambios
        }
      );
    } else {
      console.error('No token found or user ID is missing. Please log in.');
      this.isProcessing[avisoId] = false;
      this.cdr.markForCheck(); // Marca para detección de cambios
    }
  }

  editAviso(aviso: Aviso): void {
    this.router.navigate(['/avisos/edit', aviso._id]);
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

  navigateToCreateAviso(): void {
    this.router.navigate(['/avisos/new']);
  }

  canDelete(): boolean {
    return this.userRole === 'admin' || this.userRole === 'janitor';
  }

  canCreate(): boolean {
    return this.userRole === 'admin' || this.userRole === 'janitor';
  }

  canEdit(aviso: Aviso): boolean {
    return this.currentUserId === aviso.author._id || this.userRole === 'admin';
  }

  toggleComments(avisoId: string): void {
    this.showComments[avisoId] = !this.showComments[avisoId];
  }

  canEditComment(comment: Comment): boolean {
    return this.currentUserId === comment.author._id || this.userRole === 'admin';
  }

  canDeleteComment(comment: Comment): boolean {
    return this.currentUserId === comment.author._id || this.userRole === 'admin';
  }

  updateComment(avisoId: string, commentId: string, newContent: string): void {
    const token = this.authService.getToken();
    if (token) {
      this.commentsService.updateComment(avisoId, commentId, newContent, token).subscribe(
        updatedComment => {
          const avisoIndex = this.avisos.findIndex(a => a._id === avisoId);
          if (avisoIndex !== -1) {
            const commentIndex = this.avisos[avisoIndex].comments?.findIndex(c => c._id === commentId);
            if (commentIndex !== -1 && commentIndex !== undefined) {
              this.avisos[avisoIndex].comments![commentIndex] = updatedComment;
            }
          }
          this.editingComment[commentId] = false;
          this.cdr.markForCheck();
        },
        error => {
          console.error('Error updating comment', error);
        }
      );
    }
  }
}
