import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

export abstract class ResourceService<T> {
  protected abstract getResourceUrl(): string;

  constructor(
    protected http: HttpClient,
    protected logger: LoggerService,
    protected namespace: string
  ) {}

  getAll(params?: Record<string, string | number | boolean>): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    this.logger.debug(this.namespace, 'Fetching list', params);
    return this.http.get<T[]>(this.getResourceUrl(), { params: httpParams }).pipe(
      tap((data) => this.logger.debug(this.namespace, 'List fetched', { count: data.length })),
      catchError((error) => this.handleError('getAll', error))
    );
  }

  getById(id: number | string): Observable<T> {
    this.logger.debug(this.namespace, 'Fetching by ID', { id });
    return this.http.get<T>(`${this.getResourceUrl()}/${id}`).pipe(
      tap((data) => this.logger.debug(this.namespace, 'Item fetched', data)),
      catchError((error) => this.handleError('getById', error))
    );
  }

  create(resource: T): Observable<T> {
    this.logger.debug(this.namespace, 'Creating item', resource);
    return this.http.post<T>(this.getResourceUrl(), resource).pipe(
      tap((data) => this.logger.debug(this.namespace, 'Item created', data)),
      catchError((error) => this.handleError('create', error))
    );
  }

  update(id: number | string, resource: T): Observable<T> {
    this.logger.debug(this.namespace, 'Updating item', { id, resource });
    return this.http.put<T>(`${this.getResourceUrl()}/${id}`, resource).pipe(
      tap(() => this.logger.debug(this.namespace, 'Item updated', { id })),
      catchError((error) => this.handleError('update', error))
    );
  }

  delete(id: number | string): Observable<void> {
    this.logger.debug(this.namespace, 'Deleting item', { id });
    return this.http.delete<void>(`${this.getResourceUrl()}/${id}`).pipe(
      tap(() => this.logger.debug(this.namespace, 'Item deleted', { id })),
      catchError((error) => this.handleError('delete', error))
    );
  }

  protected handleError(action: string, error: unknown): Observable<never> {
    this.logger.error(this.namespace, `Error in ${action}`, error);
    return throwError(() => error);
  }
}
