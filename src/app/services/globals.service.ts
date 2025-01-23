import {Injectable} from '@angular/core';
import {LoginRequest, User, UserPassword} from '../models/web';
import { WebClientService } from './webclient.service';
import { GameService } from './game.service';



@Injectable({
  providedIn: 'root'
})
export class AppGlobalService {

  isUserLoggedIn: boolean;
  currentUser: User | false = false;

  constructor(private service: WebClientService, private game: GameService) {
    this.isUserLoggedIn = false;
  }

  setIsUserLoggedIn(val: boolean)  {
    this.isUserLoggedIn = val;
  }


  async LoginOrRegister(u: User, up: UserPassword)  {
    const hasPassword = !!up.password;
    const hasUsername = !!u.username;
    const hasEmail = !!u.email;
    const userLoginReq = new LoginRequest(u, up);
    let user;
    debugger;
    if (hasUsername && hasPassword && !hasEmail)  {
        user = await this.service.Login(userLoginReq);
        this.currentUser = u;
        this.isUserLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
    }
    else if (hasEmail && hasUsername && hasPassword)  {
        user = await this.service.Register(userLoginReq);
        this.currentUser = u;
        this.isUserLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        console.log(u);
        console.log("logged in.")
    }
    else  {
        this.isUserLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
    }
    return this.isUserLoggedIn;
  }


}