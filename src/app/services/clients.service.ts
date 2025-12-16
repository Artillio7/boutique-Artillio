import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private baseUrl = '/api/clients';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Client[]> { return this.http.get<Client[]>(this.baseUrl); }
  getById(id: number): Observable<Client> { return this.http.get<Client>(`${this.baseUrl}/${id}`); }
  create(client: Client): Observable<Client> { return this.http.post<Client>(this.baseUrl, client); }
  update(id: number, client: Client): Observable<void> { return this.http.put<void>(`${this.baseUrl}/${id}`, client); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
