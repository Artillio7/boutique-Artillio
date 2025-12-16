import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IClient } from '../../../core/models/client.interface';
import { ClientsService } from '../../../services/clients.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: IClient[] = [];
  errorMessage = '';

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getAll().subscribe((data) => {
      this.clients = data;
    });
  }

  deleteClient(id: number): void {
    if (confirm('Etes-vous sur de vouloir supprimer ce client ?')) {
      this.errorMessage = '';
      this.clientsService.delete(id).subscribe({
        next: () => {
          this.clients = this.clients.filter((c) => c.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 403) {
            this.errorMessage =
              'Acces interdit. Vous n\'avez pas les droits pour supprimer ce client.';
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
}
