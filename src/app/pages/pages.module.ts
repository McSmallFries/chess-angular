import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameService } from '../game.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebClientService } from '../webclient.service';
import { InGamePageComponent } from './in-game/ingamepage.component';
import { SharedModule } from '../shared-components/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    InGamePageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    CommonModule
  ],
  exports: [InGamePageComponent, BrowserModule,HttpClientModule,SharedModule, CommonModule],
  providers: [GameService, WebClientService, HttpClient],
  bootstrap: [InGamePageComponent]
})
export class PagesModule { }
