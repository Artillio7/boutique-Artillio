import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { ReactiveFormsModule } from '@angular/forms';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

registerLocaleData(localeFr);
import { ClientListComponent } from './features/clients/client-list/client-list.component';
import { ClientFormComponent } from './features/clients/client-form/client-form.component';

import { CommandeListComponent } from './features/commandes/commande-list/commande-list.component';
import { CommandeFormComponent } from './features/commandes/commande-form/commande-form.component';
import { CommandeDetailComponent } from './features/commandes/commande-detail/commande-detail.component';
import { CommandeTableComponent } from './features/commandes/components/commande-table/commande-table.component';
import { FindProduitPipe } from './shared/pipes/find-produit.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ClientListComponent,
    ClientFormComponent,
    CommandeListComponent,
    CommandeFormComponent,
    CommandeDetailComponent,
    CommandeTableComponent,
    FindProduitPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
