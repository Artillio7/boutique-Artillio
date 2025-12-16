export interface IClient {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateCreation: string;
  // Collection optionnelle pour éviter les cycles lors de la sérialisation simple,
  // mais utile si le backend l'envoie (ex: DetailView)
  commandes?: import('./commande.interface').ICommande[];
}
