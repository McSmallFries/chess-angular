import { NgModule } from '@angular/core';

import { TileComponent } from '../shared-components/tile/tile.component';
import { BoardComponent } from '../shared-components/board/board.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { FormsModule } from '@angular/forms';
import { PopoverMenuComponent } from './popover-menu/popover-menu.component';

@NgModule({
  declarations: [
    TileComponent,
    ToggleSwitchComponent,
    BoardComponent,
    NavbarComponent,
    PopoverMenuComponent
  ],
  imports: [
    BrowserModule,
    CommonModule, 
    FormsModule, 
    RouterLink, 
    RouterLinkActive],
  providers: [],
  exports: [
    ToggleSwitchComponent,
    PopoverMenuComponent,
    FormsModule,
    TileComponent, 
    BoardComponent, 
    BrowserModule, 
    CommonModule, 
    NavbarComponent,
    RouterLink,
    RouterLinkActive
],
  bootstrap: [BoardComponent, 
    TileComponent, 
    ToggleSwitchComponent, 
    PopoverMenuComponent,
    NavbarComponent]
})
export class SharedModule { }
