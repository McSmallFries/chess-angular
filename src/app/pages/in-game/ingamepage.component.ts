import { Component, OnInit } from '@angular/core';
import { AppGlobalService } from 'src/app/services/globals.service';

@Component({
  selector: 'in-game-page',
  templateUrl: './ingamepage.component.html',
  styleUrls: ['./ingamepage.component.css']
})
export class InGamePageComponent implements OnInit {
  title = 'chess-angular';

  constructor(private globals: AppGlobalService)  {

  }
  async ngOnInit()  {
    await this.globals.GetNewGame().then(() =>  {
      this.globals.StartNewGame();
    });
  }
}
