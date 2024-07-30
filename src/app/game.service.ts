import { Injectable } from '@angular/core';
import { BoardMatrix, Direction, Piece, PlayerClicks, Tile } from './models/game';
import { Utilities } from './models/settings';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  utils: Utilities = new Utilities();
  board: BoardMatrix;
  tileClicks: PlayerClicks;
  isWhitesTurn = true;

  SubjectTile: Tile = new Tile();
  

  constructor()  {
    this.board = new BoardMatrix();
    this.tileClicks = new PlayerClicks();
    this.tileClicks.$_TileClicks.subscribe(this.handlePlayerClicks);
    this.newGame();
  }

  handlePlayerClicks = (tiles: Tile[]) => {
    console.log("handling deez clicks", tiles);
    if (!tiles)  { return; }
    if (tiles.length === 1)  {
      if (!tiles[0]?.currentlyOccupiedBy) { return; }
      const subjectTile = tiles[0] as Tile;
      subjectTile.currentlyOccupiedBy!.CanMoveToTiles.push(...this.calculateAvailableMoves(tiles[0].currentlyOccupiedBy) as Tile[]);
      this.SubjectTile = subjectTile
    }
    if (tiles.length === 2)  {
      this.tileClicks.$_TileClicks.next([]);
    }
  }

  newGame()  {
    
    this.putPiecesInDefaultPosition();
  }

  putPiecesInDefaultPosition()  {
    const whitePawnRow = this.board.GetRow(2) as Tile[];
    const blackPawnRow = this.board.GetRow(7) as Tile[];
    for (let tile of whitePawnRow)  {
        tile.currentlyOccupiedBy = new Piece(tile.index, 'pawn_white');
    }
    for (let tile of blackPawnRow)  {
      tile.currentlyOccupiedBy = new Piece(tile.index, 'pawn_black');
    }
    this.setTileOccupied('A8', new Piece("A8", "rook_black"));
    this.setTileOccupied('B8', new Piece("B8", "knight_black"));
    this.setTileOccupied('C8', new Piece("C8", "bishop_black"));
    this.setTileOccupied('D8', new Piece("D8", "king_black"));
    this.setTileOccupied('E8', new Piece("E8", "queen_black"));
    this.setTileOccupied('F8', new Piece("F8", "bishop_black"));
    this.setTileOccupied('G8', new Piece("G8", "knight_black"));
    this.setTileOccupied('H8', new Piece("H8", "rook_black"));

    this.setTileOccupied('A1', new Piece("A1", "rook_white"));
    this.setTileOccupied('B1', new Piece("B1", "knight_white"));
    this.setTileOccupied('C1', new Piece("C1", "bishop_white"));
    this.setTileOccupied('D1', new Piece("D1", "king_white"));
    this.setTileOccupied('E1', new Piece("E1", "queen_white"));
    this.setTileOccupied('F1', new Piece("F1", "bishop_white"));
    this.setTileOccupied('G1', new Piece("G1", "knight_white"));
    this.setTileOccupied('H1', new Piece("H1", "rook_white"));
  }

  removeTileOccupation(reference: string)  {
    const tile = this.board.BoardState.get(reference) as Tile;
    tile.currentlyOccupiedBy = undefined;
  }

  setTileOccupied(reference: string, toBeOccupiedBy: Piece)  {
    const tile = this.board.BoardState.get(reference) as Tile;
    tile.setOccupation(toBeOccupiedBy);
    this.board.BoardState.set(tile.index, tile)
  }

  getNextTile(index: string, direction: Direction, incrementor = 0)  {
    const colMapper = Utilities.ALPHABET;
    const colIdx = index[0];
    const rowIdx = Number(index[1]);
    console.log("clicked: ", index)
    let nextIndex = ''
    switch (direction)  {
      case Direction.NORTH: return colIdx + (rowIdx - 1).toString();
      case Direction.SOUTH: return colIdx + (rowIdx + 1).toString();
      case Direction.EAST: return colMapper[colMapper.indexOf(colIdx) + 1] + (rowIdx).toString();
      case Direction.WEST: return colMapper[colMapper.indexOf(colIdx) - 1] + (rowIdx).toString();
      case Direction.NORTH_EAST: return colMapper[colMapper.indexOf(colIdx) + 1] + (rowIdx - 1).toString();
      case Direction.NORTH_WEST: return colMapper[colMapper.indexOf(colIdx) - 1] + (rowIdx - 1).toString();
      case Direction.SOUTH_EAST: return colMapper[colMapper.indexOf(colIdx) + 1] + (rowIdx + 1).toString();
      case Direction.SOUTH_WEST: return colMapper[colMapper.indexOf(colIdx) - 1] + (rowIdx + 1).toString();
      default: return "";
    }
  }

  calculateAvailableMoves(piece: Piece): Tile[]  {
      if (piece.Type === 'pawn')  {
        const a = this.calculatePawnMoves(piece);
        console.log(a);
        return a;
      }
      return [];
  }

  calculatePawnMoves(piece: Piece)  {
    const validMoves = new Array<Tile>();
    const firstMove = piece.CurrentPosition === piece.StartingPosition;
    const fullVertical = this.board.GetColumn(piece.CurrentPosition[0]);
    if (firstMove)  { 
        const direction = piece.IsWhite ? Direction.SOUTH : Direction.NORTH;
        piece.Range += 1; 
        let nextTileIdx = piece.CurrentPosition;
        let canTake;
        for (let i = 0; i < piece.Range; i++)  {
            nextTileIdx = this.getNextTile(nextTileIdx, direction);
            const nextTile = this.board.BoardState.get(nextTileIdx) as Tile;
            if ((i < 1))  {
              canTake = this.checkPawnDiagonals(piece);
            }
            if (canTake && canTake?.length && !nextTile.currentlyOccupiedBy)  {
              const canTakeFoSho = canTake as Tile[]
              validMoves.push(...canTakeFoSho);
            } else if (!nextTile.currentlyOccupiedBy)  {
              validMoves.push(nextTile);
            }
        }
      }
      return validMoves;
  }

  checkPawnDiagonals(piece: Piece): false | Tile[]  {
    let tiles = [];
    const potentialTakeLeft = this.getNextTile(piece.CurrentPosition, Direction.NORTH_WEST);
    const potentialTakeRight = this.getNextTile(piece.CurrentPosition, Direction.NORTH_EAST);
    const tileNE = this.board.BoardState.get(potentialTakeLeft);
    const tileNW = this.board.BoardState.get(potentialTakeRight);
    if (tileNE?.currentlyOccupiedBy)  {
      const notBlockedBySelf = tileNE.currentlyOccupiedBy.IsWhite !== piece.IsWhite;
      tiles.push(tileNE);
    }
    if (tileNW?.currentlyOccupiedBy)  {
      const notBlockedBySelf = tileNW.currentlyOccupiedBy.IsWhite !== piece.IsWhite;
      tiles.push(tileNW);
    }

    return tiles.length ? tiles : false;
  }
}
