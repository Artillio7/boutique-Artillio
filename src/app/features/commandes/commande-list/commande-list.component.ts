import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ICommande } from '../../../core/models/commande.interface';
import { CommandeService } from '../commande.service';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/auth.interface';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent {
  commandes$: Observable<ICommande[]>;
  clientId: number | null = null;
  errorMessage = '';

  constructor(
    private commandeService: CommandeService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.commandes$ = this.route.queryParams.pipe(
      switchMap(params => {
        this.clientId = params['clientId'] ? +params['clientId'] : null;
        return this.commandeService.getAll(this.clientId ? { clientId: this.clientId } : undefined);
      })
    );
  }

  onDelete(id: number): void {
    if (confirm('Etes-vous sur de vouloir supprimer cette commande ?')) {
      this.errorMessage = '';
      this.commandeService.delete(id).subscribe({
        next: () => {
          this.refresh();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 403) {
            this.errorMessage =
              'Acces interdit. Vous n\'avez pas les droits pour supprimer cette commande.';
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la suppression.';
          }
        }
      });
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }

  private refresh(): void {
    const params = this.route.snapshot.queryParams;
    this.clientId = params['clientId'] ? +params['clientId'] : null;
    this.commandes$ = this.commandeService.getAll(
      this.clientId ? { clientId: this.clientId } : undefined
    );
  }

  canCreateCommande(): boolean {
    return this.authService.hasAnyRole([Role.ADMIN, Role.GESTIONNAIRE_COMMANDES]);
  }
}
