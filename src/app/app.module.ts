import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { BoardComponent } from './board/board.component';
import { GameService } from './game.service';
import { Tile } from './models/game';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebClientService } from './webclient.service';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    BoardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [GameService, WebClientService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
