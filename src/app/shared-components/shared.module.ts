import { NgModule } from '@angular/core';

import { TileComponent } from '../shared-components/tile/tile.component';
import { BoardComponent } from '../shared-components/board/board.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    TileComponent,
    BoardComponent,
    NavbarComponent
  ],
  imports: [BrowserModule, CommonModule],
  providers: [],
  exports: [
    TileComponent, 
    BoardComponent, 
    BrowserModule, 
    CommonModule, 
    NavbarComponent
],
  bootstrap: [BoardComponent, TileComponent]
})
export class SharedModule { }
