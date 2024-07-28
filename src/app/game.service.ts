import { Injectable } from '@angular/core';
import { BoardMatrix, Tile } from './models/game';
import { Utilities } from './models/settings';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  utils: Utilities = new Utilities();
  board: BoardMatrix;

  constructor()  {
    this.board = new BoardMatrix();
    this.newGame();
  }

  newGame()  {
    
    this.putPiecesInDefaultPosition();
  }

  putPiecesInDefaultPosition()  {
    const whitePawnRow = this.board.GetRow(2) as Tile[];
    const blackPawnRow = this.board.GetRow(7) as Tile[];
    for (let tile of whitePawnRow)  {
        tile.currentlyOccupiedBy = "pawn_white";
    }
    for (let tile of blackPawnRow)  {
      tile.currentlyOccupiedBy = "pawn_black";
    }
    this.setTileOccupied('A8', 'rook_black');
    this.setTileOccupied('B8', 'knight_black');
    this.setTileOccupied('C8', 'bishop_black');
    this.setTileOccupied('D8', 'king_black');
    this.setTileOccupied('E8', 'queen_black');
    this.setTileOccupied('F8', 'bishop_black');
    this.setTileOccupied('G8', 'knight_black');
    this.setTileOccupied('H8', 'rook_black');

    this.setTileOccupied('A1', 'rook_white');
    this.setTileOccupied('B1', 'knight_white');
    this.setTileOccupied('C1', 'bishop_white');
    this.setTileOccupied('D1', 'king_white');
    this.setTileOccupied('E1', 'queen_white');
    this.setTileOccupied('F1', 'bishop_white');
    this.setTileOccupied('G1', 'knight_white');
    this.setTileOccupied('H1', 'rook_white');
  }

  removeTileOccupation(reference: string)  {
    const tile = this.board.BoardState.get(reference) as Tile;
    tile.currentlyOccupiedBy = '';
  }

  setTileOccupied(reference: string, occupiedBy: string)  {
    const tile = this.board.BoardState.get(reference) as Tile;
    tile.currentlyOccupiedBy = occupiedBy;
  }
}
