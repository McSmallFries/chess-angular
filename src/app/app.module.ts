import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TileComponent } from './shared-components/tile/tile.component';
import { BoardComponent } from './shared-components/board/board.component';
import { GameService } from './game.service';
import { Tile } from './models/game';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebClientService } from './webclient.service';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PagesModule
  ],
  providers: [GameService, WebClientService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
