import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICommande } from '../../../../core/models/commande.interface';

@Component({
  selector: 'app-commande-table',
  templateUrl: './commande-table.component.html',
  styleUrls: ['./commande-table.component.css']
})
export class CommandeTableComponent {
  @Input() commandes: ICommande[] = [];
  @Output() delete = new EventEmitter<number>();

  trackByCommande(index: number, commande: ICommande): number {
    return commande.id;
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }
}
