export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  roles: string[];
}

export interface ITokenPayload {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}

export interface IUser {
  email: string;
  roles: string[];
}

// Rôles disponibles dans l'application
export enum Role {
  ADMIN = 'ADMIN',
  GESTIONNAIRE_COMMANDES = 'GESTIONNAIRE_COMMANDES',
  GESTIONNAIRE_PRODUITS = 'GESTIONNAIRE_PRODUITS',
  VIEWER = 'VIEWER'
}
