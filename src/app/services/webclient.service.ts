import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { webSocket } from 'rxjs/webSocket';
import { Player } from '../models/game';
import { LoginRequest, User, UserPassword } from '../models/web';
@Injectable({
  providedIn: 'root'
})

export class WebClientService {
  
    url = 'http://localhost:1323';
    gameId: number = 0;
    socket = webSocket('ws://localhost:8081');

    constructor(private http: HttpClient) {
      this.socket.subscribe(this.socketHandler);
    }

    socketHandler = (params: any) => {
      console.log("socket: ");
        console.log(params);
    }

    async HelloWorld(): Promise<void>  {
      const meep = await this.http.get(this.url + '/hello').toPromise();
      console.log(meep)
      console.log("should be doneee")
    }

    async Login(req: LoginRequest): Promise<User>  {
      const resp = await this.http.post(this.url + '/user/login', req, {});
      return Promise.resolve(new User("", ""));
    }

    async Register(req: LoginRequest): Promise<User>  {
      const resp = await this.http.post(this.url + '/user/register', req, {});
      return Promise.resolve(new User("", ""));
    }

    async GetPlayer(token: string): Promise<Player>  {
      const resp = await this.http.get(this.url + '/player/' + token);
      console.log(resp);
      return Promise.resolve(new Player)
    }

    async LoadGameId(): Promise<number>  {
      try  {
        this.gameId = await this.http.get('/game-id') as unknown as number;
      } catch (e)  {
        console.log(e);
      }
      return Promise.resolve(this.gameId);
    }

    GetAllValidMovesString(): Promise<string>  {
      this.http.get(this.url + '/valid-moves/' + this.gameId);
      return Promise.resolve("");
    }

    async JoinLobby(player: Player)  { // need to pass a Player type
      const params = new HttpParams();
      params.set('player', JSON.stringify({player}));
      console.log(params);
      const resp = await this.http.get(this.url + '/game/new', { params }).toPromise();
      console.log(resp) // should be a game/lobby id to store on browser
    }
}