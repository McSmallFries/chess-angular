import { NgModule } from '@angular/core';

import { TileComponent } from '../shared-components/tile/tile.component';
import { BoardComponent } from '../shared-components/board/board.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@NgModule({
  declarations: [
    TileComponent,
    BoardComponent,
    NavbarComponent
  ],
  imports: [BrowserModule, CommonModule, RouterLink, RouterLinkActive],
  providers: [],
  exports: [
    TileComponent, 
    BoardComponent, 
    BrowserModule, 
    CommonModule, 
    NavbarComponent,
    RouterLink,
    RouterLinkActive
],
  bootstrap: [BoardComponent, TileComponent]
})
export class SharedModule { }
