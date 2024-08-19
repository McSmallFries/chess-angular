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
    const colMapper = Utilities.ALPHABET;
    const colIdx = index[0];
    const rowIdx = Number(index[1]);
    console.log("clicked: ", index)
    switch (direction) {
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

  calculateAvailableMoves(piece: Piece): Tile[] {
    if (piece.Type === 'pawn') {
      const a = this.calculatePawnMoves(piece);
      console.log(a);
      return a;
    }
    return [];
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
    const direction = piece.IsWhite ? Direction.SOUTH : Direction.NORTH;
    let nextTileIdx = piece.CurrentPosition;
    let canTake;
    for (let i = 0; i < piece.Range; i++) {
      nextTileIdx = this.getNextTile(nextTileIdx, direction);
      const nextTile = this.board.BoardState.get(nextTileIdx) as Tile;
      console.log("i = " + i + " nextTile = ", nextTile);
      if ((!firstMove)) {
        canTake = this.checkPawnDiagonals(piece);
        console.log("canTakeDiagonal: ", canTake);
      }
      if (canTake && canTake?.length) { //  && (nextTile.currentlyOccupiedBy?.IsWhite != piece.IsWhite) <-- might not be necessary. might need to add back tho.
        const canTakeFoSho = canTake as Tile[]
        canTakeFoSho.forEach(this.highlightUnderAttackTiles);
        validMoves.push(...canTakeFoSho);
      } 
      if (nextTile.currentlyOccupiedBy?.IsWhite != piece.IsWhite) {
        validMoves.push(nextTile);
      }
    }

    return validMoves;
  }

  checkPawnDiagonals(piece: Piece): false | Tile[] {
    let tiles = [];
    const whiteDirections = [Direction.SOUTH_EAST, Direction.SOUTH_WEST];
    const blackDirections = [Direction.NORTH_WEST, Direction.NORTH_EAST];
    const directions = piece.IsWhite ? whiteDirections : blackDirections;
    const potentialTakeLeft = this.getNextTile(piece.CurrentPosition, directions[0]);
    const potentialTakeRight = this.getNextTile(piece.CurrentPosition, directions[1]);
    const tileNE = this.board.BoardState.get(potentialTakeLeft);
    const tileNW = this.board.BoardState.get(potentialTakeRight);

    if (tileNE?.currentlyOccupiedBy) {
      const notBlockedBySelf = tileNE.currentlyOccupiedBy.IsWhite !== piece.IsWhite;
      if (notBlockedBySelf)  {
        tiles.push(tileNE);
      }
    }

    if (tileNW?.currentlyOccupiedBy) {
      const notBlockedBySelf = tileNW.currentlyOccupiedBy.IsWhite !== piece.IsWhite;
      if (notBlockedBySelf)  {
        tiles.push(tileNW);
      }
    }

    return tiles.length ? tiles : false;
  }

  highlightUnderAttackTiles = (value: Tile)  =>  {
    const tile = this.board.BoardState.get(value.index) as Tile;
    const piece = tile?.currentlyOccupiedBy as Piece;
    this.tilesUnderAttack.push(tile);
    piece.IsUnderAttack = true;
  }

  unhighlightUnderAttackTiles = (value: Tile) =>  {
    const tile = this.board.BoardState.get(value.index);
    const piece = tile?.currentlyOccupiedBy as Piece;
    piece.IsUnderAttack = false;
  }

}

