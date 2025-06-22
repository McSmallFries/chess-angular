import {Injectable} from '@angular/core';
import {LoginRequest, User, UserPassword} from '../models/web';
import { WebClientService } from './webclient.service';
import { GameService } from './game.service';
import { ChessGame, OnlineGame, Player } from '../models/game';



@Injectable({
  providedIn: 'root'
})
export class AppGlobalService {

  isUserLoggedIn: boolean;
  currentUser: User | false = false;
  chessGame: OnlineGame | false;

  giveUp: boolean = false;

  constructor(private service: WebClientService, private game: GameService) {
    this.isUserLoggedIn = false;
    this.chessGame = false;
  }

  setIsUserLoggedIn(val: boolean)  {
    this.isUserLoggedIn = val;
  }

  async GetNewGame()  {
    debugger;
    if (!this.currentUser)  {
      return;
    }
    const newPlayer = new Player(0, this.currentUser.idUser);
    const newGame = await this.service.GetNewGame(this.currentUser.idUser);
    if (!newGame)  {
      this.chessGame = false;
      // handle error case
    }
    this.chessGame = newGame;
  }

  StartNewGame()  {
    if (this.giveUp)  {
      return;
    }
    if (this.chessGame)  {
      this.service.initializeSocket(this.chessGame.gameId);
    } else {
      setTimeout(() =>  {
        this.StartNewGame();
      }, 100);
    }
  }

  async LoginOrRegister(u: User, up: UserPassword)  {
    const hasPassword = !!up.password;
    const hasUsername = !!u.username;
    const hasEmail = !!u.email;
    const userLoginReq = new LoginRequest(u, up);
    let user;
    if (hasUsername && hasPassword && !hasEmail)  {
        user = await this.service.Login(userLoginReq);
        this.currentUser = user;
        this.isUserLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
    }
    else if (hasEmail && hasUsername && hasPassword)  {
        user = await this.service.Register(userLoginReq);
        this.currentUser = user;
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