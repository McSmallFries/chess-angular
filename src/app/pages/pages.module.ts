import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameService } from '../services/game.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebClientService } from '../services/webclient.service';
import { InGamePageComponent } from './in-game/ingamepage.component';
import { SharedModule } from '../shared-components/shared.module';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home/home.component';
import { SignupPageComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InGamePageComponent,
    HomePageComponent,
    SignupPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    InGamePageComponent,
    HomePageComponent, 
    SignupPageComponent,
    BrowserModule,
    HttpClientModule,
    SharedModule, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [GameService, WebClientService, HttpClient],
  bootstrap: [HomePageComponent, InGamePageComponent, SignupPageComponent]
})
export class PagesModule { }
