import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppGlobalService } from './services/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chess-angular';

  constructor(private globals: AppGlobalService, private router: Router)  {

  }
  ngOnInit()  {
    debugger;
    this.globals.setIsUserLoggedIn(localStorage.getItem('isLoggedIn') === 'true')
    if (this.globals.isUserLoggedIn)  {
      this.router.navigate(['/dashboard']);
      return;
    } 
    else {
      this.router.navigate(['/register']);
      return;
    }
  }
}
