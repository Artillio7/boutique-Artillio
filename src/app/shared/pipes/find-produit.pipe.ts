import { Pipe, PipeTransform } from '@angular/core';
import { IProduit } from '../../core/models/produit.interface';

@Pipe({
    name: 'findProduit'
})
export class FindProduitPipe implements PipeTransform {
    transform(produits: IProduit[], id: number | string): IProduit | undefined {
        if (!id) return undefined;
        return produits.find(p => p.id === +id);
    }
}
