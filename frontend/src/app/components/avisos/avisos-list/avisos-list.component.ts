// avisos-list.component.ts

import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AvisosService } from 'src/app/services/avisos.service';
import { CommentsService } from 'src/app/services/comment.service';
import { ReactionsService } from 'src/app/services/reactions.service';
import { AuthService } from 'src/app/services/auth.service';
import { Aviso } from 'src/app/models/avisos.models';
import { Router } from '@angular/router';
import { Comment } from 'src/app/models/comments.models';
import { ToastrService } from 'ngx-toastr';

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
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
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
      this.cdr.detectChanges(); // Forzar detección de cambios
    }, error => {
      console.error('Error fetching avisos', error);
      this.toastr.error('Error al cargar avisos', 'Error');
    });
  }

  addComment(avisoId: string): void {
    const content = this.newComments[avisoId];
    const token = this.authService.getToken();

    if (token && content) {
      this.commentsService.createComment(avisoId, { content }, token).subscribe(response => {
        const comment = response; // Acceder al comentario dentro de la propiedad 'data'
        console.log('Nuevo comentario:', comment); // Verifica la estructura del comentario en la consola
        this.newComments[avisoId] = ''; // Limpiar el campo de entrada

        // Recargar los avisos para actualizar los comentarios
        this.loadAvisos();
        this.toastr.success('Comentario agregado con éxito', 'Éxito');
      }, error => {
        console.error('Error adding comment', error);
        this.toastr.error('Error al agregar comentario', 'Error');
      });
    } else {
      console.error('No token found or comment content is empty. Please log in and enter a comment.');
      this.toastr.warning('Debes iniciar sesión y escribir un comentario', 'Advertencia');
    }
  }

  fetchComments(avisoId: string): void {
    this.commentsService.getCommentsByAvisoId(avisoId).subscribe(comments => {
      const aviso = this.avisos.find(a => a._id === avisoId);
      if (aviso) {
        aviso.comments = comments || []; // Asegurarse de que comments sea siempre un array
        this.cdr.detectChanges(); // Forzar detección de cambios
      }
    }, error => {
      console.error('Error fetching comments', error);
      this.toastr.error('Error al cargar comentarios', 'Error');
    });
  }

  deleteComment(avisoId: string, commentId: string): void {
    const token = this.authService.getToken();
    if (token) {
      this.commentsService.deleteComment(avisoId, commentId, token).subscribe(() => {
        const aviso = this.avisos.find(a => a._id === avisoId);
        if (aviso) {
          aviso.comments = aviso.comments.filter(comment => comment._id !== commentId);
          this.cdr.detectChanges(); // Forzar detección de cambios
        }
        this.toastr.success('Comentario eliminado con éxito', 'Éxito');
      }, error => {
        console.error('Error deleting comment', error);
        this.toastr.error('Error al eliminar comentario', 'Error');
      });
    } else {
      console.error('No token found. Please log in.');
      this.toastr.warning('Debes iniciar sesión para eliminar comentarios', 'Advertencia');
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
        this.cdr.detectChanges(); // Forzar detección de cambios
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
            this.cdr.detectChanges(); // Forzar detección de cambios
            this.toastr.success('Reacción registrada con éxito', 'Éxito');
          }
          this.isProcessing[avisoId] = false;
        },
        (error) => {
          console.error('Error reacting to aviso', error);
          // Revertir la actualización optimista en caso de error
          this.loadAvisos();
          this.isProcessing[avisoId] = false;
          this.cdr.detectChanges(); // Forzar detección de cambios
          this.toastr.error('Error al registrar reacción', 'Error');
        }
      );
    } else {
      console.error('No token found or user ID is missing. Please log in.');
      this.isProcessing[avisoId] = false;
      this.cdr.detectChanges(); // Forzar detección de cambios
      this.toastr.warning('Debes iniciar sesión para reaccionar', 'Advertencia');
    }
  }

  editAviso(aviso: Aviso): void {
    this.router.navigate(['/avisos/edit', aviso._id]);
    this.toastr.info('Editando aviso', 'Información');
  }

  deleteAviso(id?: string): void {
    if (id) {
      this.avisosService.deleteAviso(id).subscribe(() => {
        this.loadAvisos();
        this.toastr.success('Aviso eliminado con éxito', 'Éxito');
      }, error => {
        console.error('Error deleting aviso', error);
        this.toastr.error('Error al eliminar aviso', 'Error');
      });
    } else {
      console.error('Aviso ID is undefined');
      this.toastr.warning('ID del aviso no definido', 'Advertencia');
    }
  }

  navigateToCreateAviso(): void {
    this.router.navigate(['/avisos/new']);
    this.toastr.info('Navegando a la creación de un nuevo aviso', 'Información');
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
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  canEditComment(comment: Comment): boolean {
    return this.currentUserId === comment.author._id || this.userRole === 'admin';
  }

  canDeleteComment(comment: Comment): boolean {
    return this.currentUserId === comment.author._id || this.userRole === 'admin';
  }
}
