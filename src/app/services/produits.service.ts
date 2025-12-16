import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit';

@Injectable({ providedIn: 'root' })
export class ProduitsService {
  private baseUrl = '/api/Produits';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Produit[]> { return this.http.get<Produit[]>(this.baseUrl); }
  getById(id: number): Observable<Produit> { return this.http.get<Produit>(`${this.baseUrl}/${id}`); }
  create(p: Produit): Observable<Produit> { return this.http.post<Produit>(this.baseUrl, p); }
  update(id: number, p: Produit): Observable<void> { return this.http.put<void>(`${this.baseUrl}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
