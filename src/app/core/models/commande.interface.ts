import { IClient } from './client.interface';
import { ILigneCommande } from './ligne-commande.interface';

export interface ICommande {
  id: number;
  numeroCommande: string;
  dateCommande: string;
  montantTotal: number;
  statut: string;
  clientId: number;
  client?: IClient;
  lignesCommande?: ILigneCommande[];
}
