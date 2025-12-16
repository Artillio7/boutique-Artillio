import { IProduit } from './produit.interface';
import { ICommande } from './commande.interface';

export interface ILigneCommande {
  id?: number;
  commandeId?: number;
  commande?: ICommande;
  produitId: number;
  produit?: IProduit;
  quantite: number;
}
