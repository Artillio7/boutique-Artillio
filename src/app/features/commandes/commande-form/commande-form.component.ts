import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommandeService } from '../commande.service';
import { ClientsService } from '../../../services/clients.service';
import { ProduitsService } from '../../../services/produits.service';
import { IClient } from '../../../core/models/client.interface';
import { IProduit } from '../../../core/models/produit.interface';
import { ICommande } from '../../../core/models/commande.interface';

@Component({
  selector: 'app-commande-form',
  templateUrl: './commande-form.component.html',
  styleUrls: ['./commande-form.component.css']
})
export class CommandeFormComponent implements OnInit, OnDestroy {
  commandeForm: FormGroup;
  clients: IClient[] = [];
  produits: IProduit[] = [];
  isEditMode = false;
  commandeId: number | null = null;
  montantTotal = 0;
  errorMessage = '';
  private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private commandeService: CommandeService,
        private clientsService: ClientsService,
        private produitsService: ProduitsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.commandeForm = this.fb.group({
            numeroCommande: ['', Validators.required],
            dateCommande: [new Date().toISOString().substring(0, 10), Validators.required],
            statut: ['En cours', Validators.required],
            clientId: [null, Validators.required],
            lignesCommande: this.fb.array([])
        });

        // Validateur custom : au moins une ligne valide
        this.commandeForm.setValidators(this.atLeastOneValidLine.bind(this));
    }

    private atLeastOneValidLine(control: AbstractControl): ValidationErrors | null {
        const lignes = (control.get('lignesCommande') as FormArray);
        if (!lignes || lignes.length === 0) {
            return { noValidLine: true };
        }
        const hasValidLine = lignes.controls.some(ligne =>
            ligne.get('produitId')?.value && ligne.get('quantite')?.value > 0
        );
        return hasValidLine ? null : { noValidLine: true };
    }

    ngOnInit(): void {
        this.loadClients();
        this.loadProduits();

        // Numérotation dynamique basée sur clientId
        this.commandeForm.get('clientId')!.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(cid => {
                if (cid && !this.isEditMode) {
                    const ts = Date.now().toString().slice(-6);
                    this.commandeForm.get('numeroCommande')!.setValue(`CMD-${cid}-${ts}`);
                }
            });

        // Recalcul auto du montant total
        this.lignesCommande.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.montantTotal = this.calculateTotal();
            });

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.commandeId = +params['id'];
                this.loadCommande(this.commandeId);
            } else {
                this.addLigne(); // Add one empty line by default for new orders
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get lignesCommande(): FormArray {
        return this.commandeForm.get('lignesCommande') as FormArray;
    }

    loadClients(): void {
        this.clientsService.getAll().subscribe((data: IClient[]) => this.clients = data);
    }

    loadProduits(): void {
        this.produitsService.getAll().subscribe((data: IProduit[]) => this.produits = data);
    }

    loadCommande(id: number): void {
        this.commandeService.getById(id).subscribe(commande => {
            this.commandeForm.patchValue({
                numeroCommande: commande.numeroCommande,
                dateCommande: commande.dateCommande.substring(0, 10),
                statut: commande.statut,
                clientId: commande.clientId
            });

            this.lignesCommande.clear();
            if (commande.lignesCommande) {
                commande.lignesCommande.forEach(ligne => {
                    this.lignesCommande.push(this.fb.group({
                        produitId: [ligne.produitId, Validators.required],
                        quantite: [ligne.quantite, [Validators.required, Validators.min(1)]]
                    }));
                });
            }
        });
    }

    addLigne(): void {
        this.lignesCommande.push(this.fb.group({
            produitId: [null, Validators.required],
            quantite: [1, [Validators.required, Validators.min(1)]]
        }));
    }

    removeLigne(index: number): void {
        this.lignesCommande.removeAt(index);
    }

    calculateTotal(): number {
        let total = 0;
        this.lignesCommande.controls.forEach(control => {
            const produitId = control.get('produitId')?.value;
            const quantite = control.get('quantite')?.value;
            const produit = this.produits.find(p => p.id === +produitId);
            if (produit && quantite) {
                total += (produit.prixUnitaire || 0) * quantite;
            }
        });
        return total;
    }

    onSubmit(): void {
        if (this.commandeForm.invalid) {
            return;
        }

        const formValue = this.commandeForm.value;

        const commandeData: ICommande = {
            id: this.commandeId || 0,
            numeroCommande: formValue.numeroCommande,
            dateCommande: formValue.dateCommande,
            statut: formValue.statut,
            clientId: +formValue.clientId,
            montantTotal: this.montantTotal,
            lignesCommande: this.lignesCommande.value.map((l: { produitId: number; quantite: number }) => ({
                produitId: +l.produitId,
                quantite: +l.quantite
            }))
        };

    if (this.isEditMode && this.commandeId) {
      this.commandeService.update(this.commandeId, commandeData).subscribe({
        next: () => {
          this.router.navigate(['/commandes']);
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err);
        }
      });
    } else {
      this.commandeService.create(commandeData).subscribe({
        next: () => {
          this.router.navigate(['/commandes']);
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err);
        }
      });
    }
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status === 403) {
      this.errorMessage = 'Acces interdit. Vous n\'avez pas les droits pour effectuer cette action.';
    } else if (err.status === 401) {
      this.errorMessage = 'Session expiree. Veuillez vous reconnecter.';
    } else {
      this.errorMessage = 'Une erreur est survenue. Veuillez reessayer.';
    }
  }
}
