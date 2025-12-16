import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientListComponent } from './features/clients/client-list/client-list.component';
import { ClientFormComponent } from './features/clients/client-form/client-form.component';

import { CommandeListComponent } from './features/commandes/commande-list/commande-list.component';
import { CommandeFormComponent } from './features/commandes/commande-form/commande-form.component';
import { CommandeDetailComponent } from './features/commandes/commande-detail/commande-detail.component';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Role } from './core/models/auth.interface';

const routes: Routes = [
  // Route par défaut : redirige vers login si non connecté (géré par AuthGuard)
  { path: '', redirectTo: '/clients', pathMatch: 'full' },

  // Route login (lazy-loaded)
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },

  // Routes protégées - Clients
  {
    path: 'clients',
    component: ClientListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/new',
    component: ClientFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN, Role.GESTIONNAIRE_COMMANDES] }
  },
  {
    path: 'clients/:id',
    component: ClientFormComponent,
    canActivate: [AuthGuard]
  },

  // Routes protégées - Commandes
  {
    path: 'commandes',
    component: CommandeListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'commandes/new',
    component: CommandeFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN, Role.GESTIONNAIRE_COMMANDES] }
  },
  {
    path: 'commandes/:id',
    component: CommandeDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'commandes/:id/edit',
    component: CommandeFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN, Role.GESTIONNAIRE_COMMANDES] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
