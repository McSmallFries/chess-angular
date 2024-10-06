import { Injectable } from '@angular/core';
import { BoardMatrix, ClickRole, Direction, Piece, PlayerClicks, Tile } from './models/game';
import { Utilities } from './models/settings';
import { TileComponent } from './tile/tile.component';
import { HttpClient } from '@angular/common/http'
import { WebClientService } from './webclient.service';
@Injectable({
  providedIn: 'root'
})

export class GameService {
  utils: Utilities = new Utilities();
  board: BoardMatrix;
  tileClicks: PlayerClicks;
  IsCheckmate = false;
  BlackTilesUnderAttack = new Array<string>();
  WhiteTilesUnderAttack = new Array<string>();
  tilesUnderAttack = new Array<Tile>();
  isWhitesTurn = true;
  SubjectTile: Tile | undefined;
  SubjectPiece: Piece | undefined;

constructor(private client: WebClientService) {
    this.board = new BoardMatrix();
    this.tileClicks = new PlayerClicks();
    this.tileClicks.$_TileClicks.subscribe(this.handlePlayerClicks);
    this.newGame();
  }

  GetAllValidMovesString(): Promise<string>  {
    const moves = this.client.GetAllValidMovesString();
    return Promise.resolve(moves);
  }

  handlePlayerClicks = (tiles: TileComponent[]) => {
    this.client.HelloWorld();
    // still check if first or second click

    // click 1: request for all of player's available pieces,
    // valid moves, thru websocket 
    
    // click 2: check if was loaded into clickedPiece's
    // canMoveTo array.
    console.log("handling deez clicks", tiles);
    if (!tiles) { return; }
    if (tiles.length > 2) {
      this.SubjectTile = new Tile();
      this.SubjectPiece = undefined;
      this.tileClicks.$_TileClicks.next([]);
    }

    if (tiles.length === ClickRole.SECOND_CLICK) {
      
      return;
    }

    // if (!tiles[0]?.tile.currentlyOccupiedBy) { return; }

    if (tiles.length === ClickRole.FIRST_CLICK) {
      this.SubjectTile = tiles[0].tile as Tile;
      this.SubjectTile.currentlyOccupiedBy?.CanMoveToTiles
        .push(...this.calculateAvailableMoves(this.SubjectTile.currentlyOccupiedBy as Piece) as Tile[]);
      this.SubjectPiece = this.SubjectTile.currentlyOccupiedBy;

      this.board.PrintBoard(); // TODO remove.
    }
  }

  public setSubjectPieceAndTile(piece: Piece | undefined, tile: Tile | undefined): void  {
    this.SubjectPiece = piece;
    this.SubjectTile = tile
  }

  newGame() {

    this.putPiecesInDefaultPosition();
  }

  isTileStillUnderAttack(index: string)  {
    const tile = this.board.BoardState.get(index);
    const piece = tile?.currentlyOccupiedBy;
  }

  getTileFromMap(idx: string): Tile  {
    const tile = this.board.BoardState.get(idx);
    return tile ? tile : new Tile();
  }

  setTileInMap(tile: Tile)  {
    this.board.BoardState.set(tile.index, tile);
  }

  // declareAttacksOnFrontRow()  {
  //   const whiteSide = this.board.BoardAccess.get('row3')?.map(t => t.index) as string[];
  //   const blackSide = this.board.BoardAccess.get('row6')?.map(t => t.index) as string[];
  //   this.WhiteTilesUnderAttack = blackSide;
  //   this.BlackTilesUnderAttack = whiteSide;
  // }

  putPiecesInDefaultPosition() {
    const whitePawnRow = this.board.GetRow(2) as Tile[];
    const blackPawnRow = this.board.GetRow(7) as Tile[];
    for (let tile of whitePawnRow) {
      const pc = new Piece(tile.index, 'pawn_white');
      pc.CurrentlyAttacking = this.board.CheckPawnDiagonals(pc, false).map(t => t.index);
      //this.BlackTilesUnderAttack.push(...pc.CurrentlyAttacking);
      this.setTileOccupied(tile.index, pc);
    }
    for (let tile of blackPawnRow) {
      const pc = new Piece(tile.index, 'pawn_black');
      pc.CurrentlyAttacking = this.board.CheckPawnDiagonals(pc, false).map(t => t.index);
      // this.WhiteTilesUnderAttack.push(...pc.CurrentlyAttacking);
      this.setTileOccupied(tile.index, pc);
    }
    this.setTileOccupied('A8', new Piece("A8", "rook_black"));
    this.setTileOccupied('B8', new Piece("B8", "knight_black")); // TODO call calculate functions
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

  removeTileOccupation(reference: string) {
    const tile = this.board.BoardState.get(reference) as Tile;
    tile.currentlyOccupiedBy = undefined;
  }


  setTileOccupied(reference: string, toBeOccupiedBy: Piece) {
    const tile = this.board.BoardState.get(reference) as Tile;
    tile.setOccupation(toBeOccupiedBy);
    this.board.BoardState.set(tile.index, tile)
  }

  getNextTile(index: string, direction: Direction, incrementor = 0) {
    return this.board.GetNextTile(index, direction);
  }

  pushUnderAttack(isWhite: boolean, value: string[])  {
    if (isWhite)  {
      this.WhiteTilesUnderAttack = value;
    } else  {
      this.BlackTilesUnderAttack = value;
    }
  }

  getTilesUnderAttack(isWhite: boolean)  {
    if (isWhite)  {
      return this.WhiteTilesUnderAttack;
    }
    return this.BlackTilesUnderAttack;
  }

  initializeCurrentlyAttacking()  {

  }

  calculateAvailableMoves(piece: Piece): Tile[] {
    // this.UpdateCurrentlyAttacking(piece.CurrentPosition);
    switch (piece.Type) {
      case 'pawn': {
        const moves = this.calculatePawnMoves(piece);
        console.log(moves);
        return moves;
      }
      case 'bishop': {
        const moves = this.calculateBishopMove(piece);
        console.log(moves);
        return moves;
      }
      case 'king': {
        const moves = this.calculateKingMoves(piece)
        console.log("king moves", moves);
        return moves;
      }
    }
    return [];
  }


  calculateKingMoves(piece: Piece)  {
    let nextTileIdx = piece.CurrentPosition;
    const validMoves = new Array<Tile>();
    const directions = piece.GetDirections();
    const tilesUnderAttack = this.getTilesUnderAttack(piece.IsWhite);
    const currentlyAttacking: string[] = piece.CurrentlyAttacking;
    const isInCheck = tilesUnderAttack.find(s => s == nextTileIdx);
    const canCastle = false;
    let canTake;
    let candidateTiles: Tile[] = [];
    for (let i = 0; i < piece.Range; i++)  {
        directions.forEach(direction => {
          const idx = this.getNextTile(nextTileIdx, direction);
          const nextTile = this.board.BoardState.get(idx);
          const nextPiece = nextTile?.currentlyOccupiedBy;
          const isNextOccupied = !!nextPiece;
          const isNextUnderAttack = tilesUnderAttack.find(s => s == idx);
          if (isNextUnderAttack)  {
              return;
          }
          if (!nextTile)  {
              return;
          }
          if (!isNextOccupied)  {
            candidateTiles.push(nextTile);
          } else {
            const isBlockedBySelf = nextPiece!.IsWhite === piece.IsWhite;
            if (isBlockedBySelf) return;
            currentlyAttacking.push(nextTile.index);
            candidateTiles.push(nextTile);
          }
        });
        
        if (canCastle)  {
          const castleKing = this.getNextTile(piece.StartingPosition, Direction.CASTLE_KINGSIDE);
          const castleQueen = this.getNextTile(piece.StartingPosition, Direction.CASTLE_QUEENSIDE);
          candidateTiles.push(this.board.BoardState.get(castleKing) as Tile, this.board.BoardState.get(castleQueen) as Tile);
        }
        if (isInCheck)  {
          // filter moves that dont remove check
        }
    }
    
    validMoves.push(...candidateTiles.filter(t => !tilesUnderAttack.find(s => t.index === s)));
    this.DeclareAttack(piece.CurrentPosition, validMoves.map(t => t.index));
    return validMoves;
  }

  calculatePawnMoves(piece: Piece) {
    const validMoves = new Array<Tile>();
    const firstMove = piece.CurrentPosition === piece.StartingPosition;
    // const fullVertical = this.board.GetColumn(piece.CurrentPosition[0]);
    if (firstMove) {
      piece.Range = 2;
    } else {
      piece.Range = 1;
    }
    const direction = piece.GetDirections();
    let nextTileIdx = piece.CurrentPosition;
    let canTake;
    for (let i = 0; i < piece.Range; i++) {
      nextTileIdx = this.getNextTile(nextTileIdx, direction[0]);
      const nextTile = this.board.BoardState.get(nextTileIdx) as Tile;
      console.log("i = " + i + " nextTile = ", nextTile);
      canTake = this.board.GetPieceIsAttacking(piece);
      console.log("canTakeDiagonal: ", canTake);
      
      if (canTake && canTake?.length) { //  && (nextTile.currentlyOccupiedBy?.IsWhite != piece.IsWhite) <-- might not be necessary. might need to add back tho.
        const canTakeFoSho = canTake as Tile[]
        canTakeFoSho.forEach(this.highlightUnderAttackTiles);
        validMoves.push(...canTakeFoSho);
        this.DeclareAttack(piece.CurrentPosition, this.board.CheckPawnDiagonals(piece, false).map(t => t.index));
      } 
      if (nextTile.currentlyOccupiedBy?.IsWhite != piece.IsWhite) {
        validMoves.push(nextTile);
      }
    }

    return validMoves;
  }

  calculateBishopMove(piece: Piece): Tile[]  {
    const validMoves = new Array<Tile>();
    const directions = piece.GetDirections();
    const tilesUnderAttack = this.getTilesUnderAttack(piece.IsWhite);
    const initialIdx = piece.CurrentPosition
    let nextTileIdx = initialIdx;
    let canTake = [];
    directions.forEach(direction => {
      for (let i = 0; i < piece.Range; i++) {
        const idx = this.getNextTile(nextTileIdx, direction);
        const nextTile = this.board.BoardState.get(idx);
        const nextPiece = nextTile?.currentlyOccupiedBy;
        const isNextOccupied = !!nextPiece;
        const isNextUnderAttack = tilesUnderAttack.find(s => s == idx);
        if (!nextTile)  {
            nextTileIdx = initialIdx;
            return;
        }
        if (!isNextOccupied)  {
          validMoves.push(nextTile);
        } else {
          const isBlockedBySelf = nextPiece!.IsWhite === piece.IsWhite;
          if (isBlockedBySelf) return;
          canTake.push(nextTile.index);
          validMoves.push(nextTile);
        }
        nextTileIdx = idx;
      }
    });
    return validMoves;
  }

  SetPieceInMap(tileIdx: string, toValue: Piece)  {
    const tile = this.board.BoardState.get(tileIdx) as Tile;
    if (tile && tile.index === toValue.CurrentPosition)  {
      tile.currentlyOccupiedBy = toValue;
      this.board.BoardState.set(tileIdx, tile);
    }
  }

  DeclareAttack(perpIdx: string, victimsIdxs: string[])  {
    const perpetrator = this.board.BoardState.get(perpIdx)?.currentlyOccupiedBy;
    perpetrator!.CurrentlyAttacking = new Array<string>(...victimsIdxs);
    for (let i = 0; i < victimsIdxs.length; i++)  {
      const idx = victimsIdxs[i];
      // if (perpetrator?.IsWhite)  {
      //   this.BlackTilesUnderAttack.push(idx);
      // } else if (!perpetrator?.IsWhite)  {
      //   this.WhiteTilesUnderAttack.push(idx);
      // }
    }
    this.SetPieceInMap(perpIdx, perpetrator as Piece);
  }

// UpdateCurrentlyAttacking(perpIdx: string)  {
//     const piece = this.getTileFromMap(perpIdx).currentlyOccupiedBy as Piece;
//     if (piece)  {
//       const currentlyAttacking = this.getTilesUnderAttack(!piece.IsWhite);
//       currentlyAttacking.forEach(idx => {
//         const foundAt = piece.CurrentlyAttacking.findIndex(s => s === idx);
//         if (foundAt)  {
//           piece.CurrentlyAttacking = piece.CurrentlyAttacking.splice(foundAt, 1);
//           const newFoundAt = currentlyAttacking.findIndex(s => s === idx)
//           if (!newFoundAt) return;
//           this.setTilesUnderAttack(!piece.IsWhite, currentlyAttacking.splice(newFoundAt, 1)); 
//         }
//       });
//       piece.CurrentlyAttacking = this.GetAttackOf(piece);
//       this.SetPieceInMap(perpIdx, piece);
//     }
//   }

  GetAttackOf(piece: Piece)  {
    switch(piece.Type) {
      case "pawn": return this.board.CheckPawnDiagonals(piece).map(t => t.index);
      case "king": return this.calculateKingMoves(piece).map(t => t.index);
    }
    return [];
  }

  highlightUnderAttackTiles = (value: Tile)  =>  {
    const tile = this.board.BoardState.get(value.index) as Tile;
    const piece = tile?.currentlyOccupiedBy as Piece;
    this.tilesUnderAttack.push(tile);
    tile.isHighlighted = true;
    piece.IsUnderAttack = true;
  }

  unhighlightUnderAttackTiles = (value: Tile) =>  {
    const tile = this.board.BoardState.get(value.index) as Tile;
    const piece = tile?.currentlyOccupiedBy as Piece;
    piece.IsUnderAttack = false;
    tile.isHighlighted = false;
    this.tilesUnderAttack = [];
  }

}

