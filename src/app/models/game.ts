import { BehaviorSubject, of } from "rxjs";
import { Utilities } from "./settings";
import { TileComponent } from "../tile/tile.component";
import { GameService } from "../game.service";

export enum ClickRole  {
  FIRST_CLICK = 1,
  SECOND_CLICK = 2
}


export enum Direction  {
  NORTH = 1,
  SOUTH = 2,
  EAST = 3,
  WEST = 4,
  NORTH_WEST = 5,
  NORTH_EAST = 6,
  SOUTH_EAST = 7,
  SOUTH_WEST = 8,
  NONE = 9,
  HORSEY = 10,
  CASTLE_KINGSIDE = 11,
  CASTLE_QUEENSIDE = 12
}


export class PlayerClicks  {
    $_TileClicks: BehaviorSubject<TileComponent[]>;
    
    constructor()  {
        this.$_TileClicks = new BehaviorSubject<TileComponent[]>([]);
    }
}

export interface Movable  {

  move(nextIndex: string): boolean;

}

export class Piece implements Movable {
  StartingPosition: string;
  CurrentPosition: string;
  PieceName: string;
  FileName: string;
  CanMoveToTiles: Tile[];
  CurrentlyAttacking: string[];
  IsWhite: boolean;
  IsUnderAttack: boolean;
  Range: number;
  Type: string;

  constructor(startingPosition: string, name: string)  {
    const attributes = name.split('_');
    this.StartingPosition = startingPosition;
    this.CurrentPosition = startingPosition;
    this.PieceName = name;
    this.FileName = `${name}.png`;
    this.CanMoveToTiles = new Array<Tile>();
    this.Type = attributes[0];
    this.IsWhite = attributes[1] === `white`
    this.Range = this.getRange();
    this.IsUnderAttack = false;
    this.CurrentlyAttacking = [];
  }

  move(nextIndex: string): boolean {
    throw new Error("Method not implemented.");
  }

  getStartingAttacks(piece: Piece, fn: (piece: Piece) => Tile[])  {
    switch(this.Type)  {
      case 'pawn':
      case 'knight':
      case 'king':
      case 'bishop':
      case 'queen':
      case 'rook': return fn;
      default: return [];
    }
  }

  getRange()  {
    switch(this.Type)  {
      case 'king':
      case 'pawn': return 1;
      case 'bishop': return 8;
      case 'queen':
      case 'rook': return 8;
      case 'knight': return 3;
      default: return 0;
    }
  }

  GetDirections(): Direction[] {
    switch(this.Type)  {
      case 'king': return [
        Direction.NORTH_EAST, Direction.NORTH_WEST, Direction.SOUTH_EAST, Direction.SOUTH_WEST,
        Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST
      ] as number[];
      case 'queen':return [
        Direction.NORTH_EAST, Direction.NORTH_WEST, Direction.SOUTH_EAST, Direction.SOUTH_WEST,
        Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST
      ] as number[];

      case 'pawn': return this.IsWhite ? [Direction.SOUTH] : [Direction.NORTH];
      case 'bishop':return [Direction.NORTH_EAST, Direction.NORTH_WEST, Direction.SOUTH_EAST, Direction.SOUTH_WEST];
      case 'rook': return [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];
      case 'knight': return [Direction.HORSEY]
      default: return [Direction.NONE] as number[];
    }
  }
}

export class JsonAttack  {
  perpetrator: string; // index: starting pos
  victim: string; 
  perpTile: string;
  victimTile: string;

  constructor(perp: string, victim: string, perpTile: string, victTile: string)  {
    this.perpetrator = perp;
    this.victim = victim;
    this.perpTile = perpTile;
    this.victimTile = victTile;
  }

  static AsString(m: JsonAttack): string  {
    return JSON.stringify(m);
  }

  static AsObject(o: string): JsonAttack[]  {
    const rowStr = o.split(", ");
    let moves = new Array<JsonAttack>();
    rowStr.forEach(r => moves.push(JSON.parse(r)));
    return moves;
  }
}

export class JsonMove  {
  pieceID: string;
  pieceColor: string;
  movedFrom: string;
  movedTo: string;
  takenPiece: string;

  constructor(id: string, color: string, from: string, to: string, captured: string)  {
    this.pieceID = id;
    this.pieceColor = color;
    this.movedFrom = from;
    this.movedTo = to;
    this.takenPiece = captured
  }

  static AsString(m: JsonMove): string  {
    return JSON.stringify(m);
  }

  static AsObject(o: string): JsonMove[]  {
    const rowStr = o.split(", ");
    let moves = new Array<JsonMove>();
    rowStr.forEach(r => moves.push(JSON.parse(r)));
    return moves;
  }

  static ConvertFromNotationToJsonMove(notation: string): JsonMove  {

    return {} as JsonMove;
  }
}

export class BoardMatrix  {

  BoardState: Map<string, Tile>;
  BoardAccess: Map<string, Tile[]>;
  BoardMoves: Map<string, string>;

  constructor()  {
    this.BoardState = new Map<string, Tile>();
    this.BoardMoves = new Map<string, string>();
    this.BoardAccess = new Map<string, Tile[]>();
    for (let cols = 1; cols < 9; cols++)  {
      const letter = Utilities.ALPHABET[cols - 1];
      for (let rows = 1; rows < 9; rows++)  {
        const conditionA = ((rows - 1) % 2 === 0 && (cols - 1) % 2 === 0);
        const conditionB = ((rows - 1) % 2 === 1 && (cols - 1) % 2 === 1);
        const isWhite = conditionA || conditionB;
        const tileIdx = letter + rows.toString();
        this.BoardState.set(tileIdx, new Tile(tileIdx, isWhite));
      }
    }
    this.BoardAccess.set('row1', this.GetRow(1));
    this.BoardAccess.set('row2', this.GetRow(2));
    this.BoardAccess.set('row3', this.GetRow(3));
    this.BoardAccess.set('row4', this.GetRow(4));
    this.BoardAccess.set('row5', this.GetRow(5));
    this.BoardAccess.set('row6', this.GetRow(6));
    this.BoardAccess.set('row7', this.GetRow(7));
    this.BoardAccess.set('row8', this.GetRow(8));
  }

  public PrintBoard(): void  {
    console.log("PRINTING");
    for (let i = 0; i < 8; i++)  {
      console.log( this.GetRow(i + 1))
    }
    
  }

  public StoreMove(piece: Piece, fromTile: Tile, toTile: Tile, takenPiece = ""): void  {
    if (!piece) return;
    const pieceID = piece.StartingPosition;
    const pieceColor = piece.IsWhite ? "Wh_" : "Bl_";
    const movedFrom = fromTile.index;
    const movedTo = toTile.index;
    const move = new JsonMove(pieceID, pieceColor, movedFrom, movedTo, takenPiece);
    let fullString = JSON.stringify(move);
    let existingMoves = this.BoardMoves.get(pieceID);
    if (existingMoves)  {
      fullString += existingMoves;
    }
    this.BoardMoves.set(pieceID, fullString)
    console.log("full: ", fullString);
  }

  GetNextTile(index: string, direction: Direction)  {
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

  GetPieceIsAttacking(piece: Piece): Tile[] | false {
      switch (piece.Type)  {
        case "pawn": {
          return this.CheckPawnDiagonals(piece);
        };
        case "king": return this.findKingIsAttacking(piece);
        default: return false
      }
  }

  CheckPawnDiagonals(piece: Piece, requireEnemyOccupation = true)  {
    let tiles = [];
    const whiteDirections = [Direction.SOUTH_EAST, Direction.SOUTH_WEST];
    const blackDirections = [Direction.NORTH_WEST, Direction.NORTH_EAST];
    const directions = piece.IsWhite ? whiteDirections : blackDirections;
    const potentialTakeLeft = this.GetNextTile(piece.CurrentPosition, directions[0]);
    const potentialTakeRight = this.GetNextTile(piece.CurrentPosition, directions[1]);
    const tileNE = this.BoardState.get(potentialTakeLeft);
    const tileNW = this.BoardState.get(potentialTakeRight);
    if (!requireEnemyOccupation)  {
       if (tileNE)  {
        tiles.push(tileNE);
       }
       if (tileNW)  {
        tiles.push(tileNW);
       }
       return tiles;
    }

    if (tileNE?.currentlyOccupiedBy) {
      const blockedBySelf = tileNE.currentlyOccupiedBy.IsWhite === piece.IsWhite;
      if (!blockedBySelf)  {
        tiles.push(tileNE);
      }
    }

    if (tileNW?.currentlyOccupiedBy) {
      const blockedBySelf = tileNW.currentlyOccupiedBy.IsWhite === piece.IsWhite;
      if (!blockedBySelf)  {
        tiles.push(tileNW);
      }
    }

    return tiles.length ? tiles : [];
  }

  private findKingIsAttacking(piece: Piece): Tile[] | false  {

    return [];
  }

  public FindCurrentTileByPieceStartIndex(startIdx: string): Tile | undefined  {
      const movesStr = this.BoardMoves.get(startIdx);
      if (!movesStr)  {
        return this.BoardState.get(startIdx)
      }
      const moves = JsonMove.AsObject(movesStr);
      const latestMove = moves[0];
      const isCorrectTile = latestMove.pieceID === startIdx;
      const found = this.BoardState.get(latestMove.movedTo);
      if (isCorrectTile && found)  {
        return found;
      }
      return undefined;
  }

  public GetRow(rowIdx: number): Tile[]  {
    if (rowIdx > 8)  {
      return [];
    }
    const row: Tile[] = [];
    for (let i = 0; i < 8; i++)  {
      const index = `${Utilities.ALPHABET[i]}${rowIdx}`;
      row.push(this.BoardState.get(index) as Tile);
    }
    return row;
  }



  public GetColumn(columnIdx: string): Tile[]  {
    if (columnIdx.length > 1)  {
      return [];
    }
    if (!Utilities.ALPHABET.includes(columnIdx))  {
      return [];
    }
    const column: Tile[] = [];
    /* Gets (columnIdx 1 - 8) e.g. A1, A2, A3, ... A8*/
    for ( let i = 1; i < 9; i++ )  {
      const index = `${columnIdx}${i}`;
      column.push(this.BoardState.get(index) as Tile);
    }
    return column;
  }
}

export class Tile  {
  index: string;
  isWhite: boolean;
  isHighlighted: boolean;
  currentlyOccupiedBy: Piece | undefined;

  constructor(index: string = '', isWhite: boolean = false)  {
    this.isWhite = isWhite;
    this.index = index;
    this.isHighlighted = false;
  }

  setOccupation(newPiece: Piece)  {
    if (!this.currentlyOccupiedBy)  {
      this.currentlyOccupiedBy = newPiece;
    }
  }

  static CopyFrom(tile: Tile | undefined): Tile  {
    if (!tile)  {
      return new Tile()
    } else {
      return tile;
    }
  }
}

export class OnlineGame  {
  // make a http method that uses this to find the 
  // stored game on the server and load game
  //  info based on these values.
  gameId: string = ''; 
  lobbyId: string = '';
}

export class ChessGame  {

}

export class Host  {
  id: number = 0;
  ipAddress: string = '';
}

export class Lobby {
  host: Host = {} as Host;
  isFull: boolean = false;
  inProgress: boolean = false; 
  player1: Player = {} as Player;
  player2: Player = {} as Player;
}

export class Player  {
  id: number = 0;
  name: string = '';
}