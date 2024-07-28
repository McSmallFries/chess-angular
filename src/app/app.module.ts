import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { BoardComponent } from './board/board.component';
import { GameService } from './game.service';
import { Tile } from './models/game';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    BoardComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
