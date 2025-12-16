import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {
  ILoginCredentials,
  IAuthResponse,
  ITokenPayload,
  IUser
} from '../models/auth.interface';
import { LoggerService } from './logger.service';

const TOKEN_KEY = 'auth_token';
const ROLES_KEY = 'auth_roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      const payload = this.decodeToken(token);
      if (payload) {
        this.currentUserSubject.next({
          email: payload.email,
          roles: payload.roles
        });
      }
    } else {
      this.clearStorage();
    }
  }

  login(credentials: ILoginCredentials): Observable<IAuthResponse> {
    this.logger.debug('AuthService', 'Tentative de connexion', {
      email: credentials.email
    });

    return this.http
      .post<IAuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.logger.info('AuthService', 'Connexion réussie');
          localStorage.setItem(TOKEN_KEY, response.token);
          localStorage.setItem(ROLES_KEY, JSON.stringify(response.roles));

          const payload = this.decodeToken(response.token);
          if (payload) {
            this.currentUserSubject.next({
              email: payload.email,
              roles: response.roles
            });
          }
        }),
        catchError((error) => {
          this.logger.error('AuthService', 'Échec de connexion', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.logger.info('AuthService', 'Déconnexion');
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLES_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return this.isTokenValid(token);
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload) {
        return false;
      }
      // Vérifie si le token n'est pas expiré
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): ITokenPayload | null {
    try {
      return jwtDecode<ITokenPayload>(token);
    } catch {
      this.logger.error('AuthService', 'Erreur de décodage du token');
      return null;
    }
  }

  hasRole(role: string): boolean {
    const rolesStr = localStorage.getItem(ROLES_KEY);
    if (!rolesStr) {
      return false;
    }
    try {
      const roles: string[] = JSON.parse(rolesStr);
      return roles.includes(role);
    } catch {
      return false;
    }
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  getRoles(): string[] {
    const rolesStr = localStorage.getItem(ROLES_KEY);
    if (!rolesStr) {
      return [];
    }
    try {
      return JSON.parse(rolesStr);
    } catch {
      return [];
    }
  }

  getCurrentUserEmail(): string | null {
    const user = this.currentUserSubject.getValue();
    return user?.email || null;
  }
}
