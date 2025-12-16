import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ICommande } from '../../../core/models/commande.interface';
import { CommandeService } from '../commande.service';

@Component({
  selector: 'app-commande-detail',
  templateUrl: './commande-detail.component.html',
  styleUrls: ['./commande-detail.component.css']
})
export class CommandeDetailComponent {
  commande$: Observable<ICommande>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commandeService: CommandeService
  ) {
    this.commande$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.router.navigate(['/commandes']);
          throw new Error('No ID provided');
        }
        return this.commandeService.getById(+id);
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/commandes']);
  }
}
