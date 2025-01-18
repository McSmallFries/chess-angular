import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomePageComponent implements OnInit {
  title = 'chess-angular';

  constructor(private router: Router)  {
    
  }

  ngOnInit()  {
    this.verifyLogin();
    console.log("HOME")
  }

  verifyLogin()  {
    if (!this.isLoggedIn()) {
        this.router.navigate(['/login']);
        return false;
    } else if (this.isLoggedIn()) {
        return true;
    }
    return false;
  }

  public isLoggedIn(): boolean {
    let status = false;
    if (localStorage.getItem('isLoggedIn') === 'true') {
      status = true;
    } else {
      status = false;
    }
    return status;
}
}
