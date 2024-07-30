import { BehaviorSubject } from "rxjs";
import { Utilities } from "./settings";
import { TileComponent } from "../tile/tile.component";


export enum Direction  {
  NORTH = 1,
  SOUTH = 2,
  EAST = 3,
  WEST = 4,
  NORTH_WEST = 5,
  NORTH_EAST = 6,
  SOUTH_EAST = 7,
  SOUTH_WEST = 8
}

export class PlayerClicks  {
    $_TileClicks: BehaviorSubject<TileComponent[]>;
    constructor()  {
        this.$_TileClicks = new BehaviorSubject<TileComponent[]>([]);
    }
}

export class Piece  {
  StartingPosition: string;
  CurrentPosition: string;
  PieceName: string;
  FileName: string;
  CanMoveToTiles: Tile[];
  IsWhite: boolean;
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
  }

  getRange()  {
    switch(this.Type)  {
      case 'king': 
      case 'pawn': return 1;
      case 'bishop':
      case 'queen':
      case 'rook': return 8;
      case 'knight': return 3;
      default: return 0;
    }
  }
}
export class BoardMatrix  {
  BoardState: Map<string, Tile>;
  BoardAccess: Map<string, Tile[]>;

  constructor()  {
    this.BoardState = new Map<string, Tile>();
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
  currentlyOccupiedBy: Piece | undefined;


  constructor(index: string = '', isWhite: boolean = false)  {
    this.isWhite = isWhite;
    this.index = index;
  }

  setOccupation(newPiece: Piece)  {
    if (!this.currentlyOccupiedBy)  {
      this.currentlyOccupiedBy = newPiece;
    }
  }
}