import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GameService } from './services/game.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebClientService } from './services/webclient.service';
import { PagesModule } from './pages/pages.module';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './services/auth.guard';
import { AppGlobalService } from './services/globals.service';
import { SharedModule } from './shared-components/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PagesModule,
    RouterOutlet, 
    AppRoutingModule
  ],
  providers: [AppGlobalService, GameService, WebClientService, HttpClient, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
