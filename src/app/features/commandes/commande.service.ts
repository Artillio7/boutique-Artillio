import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../core/services/resource.service';
import { ICommande } from '../../core/models/commande.interface';
import { LoggerService } from '../../core/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class CommandeService extends ResourceService<ICommande> {
  constructor(http: HttpClient, logger: LoggerService) {
    super(http, logger, 'CommandesService');
  }

  protected getResourceUrl(): string {
    return '/api/commandes';
  }
}
