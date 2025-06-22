import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { webSocket } from 'rxjs/webSocket';
import { OnlineGame, Player } from '../models/game';
import { LoginRequest, User, UserPassword } from '../models/web';
@Injectable({
  providedIn: 'root'
})

export class WebClientService {
  
    url = 'http://localhost:8081';
    gameId: number = 0;
    socket: any;

    constructor(private http: HttpClient) {
      
    }

    initializeSocket(gameId: number): void  {
      debugger;
      if (!gameId)  {
        return;
      }
      this.socket = webSocket(`ws://localhost:8081/ws?gameId=${gameId}`);
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

    async WsConnect(id: number)  {

    }

    async GetNewGame(idUser: number): Promise<OnlineGame>  {
      try  {
        debugger;
        const resp = await this.http.get<OnlineGame>(this.url + '/game/new?idUser=' + idUser).toPromise();
        if (resp === undefined)  {
          console.log(resp);
          throw new Error
        }
        return Promise.resolve(resp!);
      } catch (err)  {
        return Promise.reject();
      }
    }

    async Login(req: LoginRequest): Promise<User>  {
      try  {
        debugger;
        const resp = await this.http.post<User | undefined>(this.url + '/user/login', req, {}).toPromise();
        if (resp === undefined)  {
          console.log("user not logged in");
          throw new Error;
        }
        return Promise.resolve(resp!);
      } catch (err)  {
        return Promise.reject('error')
      }
      
    }

    async Register(req: LoginRequest): Promise<User>  {
      try  {
        debugger;
        const resp: User | undefined = await this.http.post<User | undefined>
        (this.url + '/user/register', req, {}).toPromise();
        if (resp === undefined) {
          console.log("user not registered")
          throw new Error
        };
        return Promise.resolve(resp!);
      } catch (err)  {
        return Promise.reject('error.');
      }
    }

    async GetPlayer(token: string): Promise<Player>  {
      const resp = await this.http.get(this.url + '/player/' + token).toPromise();
      console.log(resp);
      // return Promise.resolve(new Player(resp))
      // REJECTS :O
      return Promise.reject();
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