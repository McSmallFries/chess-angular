import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { webSocket } from 'rxjs/webSocket';
@Injectable({
  providedIn: 'root'
})

export class WebClientService {
  
    url = 'http://localhost:1323';
    gameId: number = 0;
    socket = webSocket('ws://locahost:8081');

    constructor(private http: HttpClient) {
      
    }

    async HelloWorld(): Promise<void>  {
      const meep = await this.http.get(this.url + '/hello').toPromise();
      console.log(meep)
      console.log("should be doneee")
    }

    async LoadGameId(): Promise<number>  {
      try  {
        this.gameId = this.http.get('/game-id') as unknown as number;
      } catch (e)  {
        console.log(e);
      }
      return Promise.resolve(this.gameId);
    }

    GetAllValidMovesString(): Promise<string>  {
      this.http.get(this.url + '/valid-moves/' + this.gameId);
      return Promise.resolve("");
    }

    JoinLobby()  {

    }
}