import { Injectable } from '@angular/core';
import { BoardMatrix, ClickRole, Direction, Piece, PlayerClicks, Tile } from './models/game';
import { Utilities } from './models/settings';
import { TileComponent } from './tile/tile.component';

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

  constructor() {
    this.board = new BoardMatrix();
    this.tileClicks = new PlayerClicks();
    this.tileClicks.$_TileClicks.subscribe(this.handlePlayerClicks);
    this.newGame();
  }

  handlePlayerClicks = (tiles: TileComponent[]) => {
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

  putPiecesInDefaultPosition() {
    const whitePawnRow = this.board.GetRow(2) as Tile[];
    const blackPawnRow = this.board.GetRow(7) as Tile[];
    for (let tile of whitePawnRow) {
      this.setTileOccupied(tile.index, new Piece(tile.index, 'pawn_white'));
    }
    for (let tile of blackPawnRow) {
      this.setTileOccupied(tile.index, new Piece(tile.index, 'pawn_black'));
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

  getTilesUnderAttack(isWhite: boolean)  {
    if (isWhite)  {
      return this.WhiteTilesUnderAttack;
    }
    return this.BlackTilesUnderAttack;
  }

  calculateAvailableMoves(piece: Piece): Tile[] {
    debugger;
    switch (piece.Type) {
      case 'pawn': {
        const moves = this.calculatePawnMoves(piece);
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
            candidateTiles.push(nextTile)
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
    validMoves.push(...candidateTiles);
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
      if ((!firstMove)) {
        canTake = this.board.GetPieceIsAttacking(piece);
        console.log("canTakeDiagonal: ", canTake);
      }
      if (canTake && canTake?.length) { //  && (nextTile.currentlyOccupiedBy?.IsWhite != piece.IsWhite) <-- might not be necessary. might need to add back tho.
        const canTakeFoSho = canTake as Tile[]
        canTakeFoSho.forEach(this.highlightUnderAttackTiles);
        validMoves.push(...canTakeFoSho);
        const indexes = canTakeFoSho.map(t => t.index);
        this.DeclareAttack(piece.CurrentPosition, indexes);
      } 
      if (nextTile.currentlyOccupiedBy?.IsWhite != piece.IsWhite) {
        validMoves.push(nextTile);
      }
    }

    return validMoves;
  }

  DeclareAttack(perpIdx: string, victimsIdxs: string[])  {
    const perpetrator = this.board.BoardState.get(perpIdx)?.currentlyOccupiedBy;
    for (let i = 0; i < victimsIdxs.length; i++)  {
      const idx = victimsIdxs[i];
      if (perpetrator?.IsWhite)  {
        this.BlackTilesUnderAttack.push(idx)
      } else if (!perpetrator?.IsWhite)  {
        this.WhiteTilesUnderAttack.push(idx);
      }
    }
  }

  highlightUnderAttackTiles = (value: Tile)  =>  {
    const tile = this.board.BoardState.get(value.index) as Tile;
    const piece = tile?.currentlyOccupiedBy as Piece;
    if (piece.IsWhite)  {
      this.WhiteTilesUnderAttack.push(tile.index);
    } else if (!piece.IsWhite)  {
      this.BlackTilesUnderAttack.push(tile.index);
    }
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

