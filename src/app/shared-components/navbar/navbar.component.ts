import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
  })
  export class NavbarComponent implements OnInit, AfterViewInit {

    constructor(private router: Router)  {

    }

    onSubmenuNavigate(params: any)  {
      console.log(params);
      switch (params)  {
        case "game":  {
          debugger;
          this.router.navigate([`/${params}`]);
        }
      }
    }

    

    ngAfterViewInit(): void {
        
    }

    ngOnInit(): void {
        
    }
  }