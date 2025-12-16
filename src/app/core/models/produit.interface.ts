export interface IProduit {
  id: number;
  libelle: string;
  prixUnitaire: number;
  stock: number;
  description?: string;
  imageUrl?: string;
}
