import { Component, OnInit } from '@angular/core';
import { SpaceService } from '../services/space.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.css']
})
export class SpacesComponent implements OnInit {
  spaces$: Observable<any[]> | undefined;
  isAdminOrJanitor: boolean = false;

  constructor(
    private spaceService: SpaceService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spaces$ = this.spaceService.getCommonSpaces();
    this.isAdminOrJanitor = this.authService.isAdminOrJanitor();
  }

  loadSpaces(): void {
    this.spaces$ = this.spaceService.getCommonSpaces();
  }

  addSpace(space: any): void {
    this.spaceService.createCommonSpace(space).subscribe(() => this.loadSpaces());
  }

  updateSpace(id: string): void {
    this.router.navigate(['/create-space', id]);
  }

  deleteSpace(_id: string): void {
    this.spaceService.deleteCommonSpace(_id).subscribe(() => this.loadSpaces());
  }

  bookSpace(id: string): void {
    this.router.navigate(['/bookings', id]);
  }
}
