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
    let id;
    if (hasUsername && hasPassword && !hasEmail)  {
        id = await this.service.Login(userLoginReq);
        this.currentUser = u;
        this.isUserLoggedIn = true;
    }
    else if (hasEmail && hasUsername && hasPassword)  {
        id = await this.service.Register(userLoginReq);
        this.currentUser = u;
        this.isUserLoggedIn = true;
    }
    else  {
        this.isUserLoggedIn = false;
    }
    return this.isUserLoggedIn;
  }


}