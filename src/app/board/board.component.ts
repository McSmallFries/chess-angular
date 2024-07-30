import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { TileComponent } from '../tile/tile.component';
import { Piece, Tile } from '../models/game';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit, AfterViewInit {

  @ViewChild('uiBoardRoot') uiBoardRoot: HTMLTableElement | undefined;
  rows: Tile[][];
  currentlyHighlighted: Tile[];
  // uiRows: TileComponent[][];

  constructor(private game: GameService) {
    // this.uiRows = [[]];
    this.rows =  [[]];
    this.currentlyHighlighted = new Array<Tile>();
  }

  onTileClick(component: TileComponent)  {
    const tileData = component.tile;
    // console.log(tile);
    console.log(component);
    const tilesClicked = this.game.tileClicks.$_TileClicks.getValue();
    const firstTile = tilesClicked[0] as TileComponent;
    const tileClicks = (firstTile) ? [firstTile, component] as TileComponent[] : [component] as TileComponent[];
    this.game.tileClicks.$_TileClicks.next(tileClicks);
    if (tileClicks?.length === 1)  {
       const tile = this.game.tileClicks.$_TileClicks.getValue()[0];
       const validMoves = tile?.tile.currentlyOccupiedBy?.CanMoveToTiles;
       this.highlightGridCells(tile?.tile.currentlyOccupiedBy, validMoves);
    }
    if (tileClicks.length === 2)  {
      const fromTile = tileClicks[0];
      const toTile = tileClicks[1];
      this.highlightGridCells(fromTile.tile.currentlyOccupiedBy, this.currentlyHighlighted, true);
      this.movePieceToTile(fromTile, toTile);
      this.game.tileClicks.$_TileClicks.next([]);
    }
  }

  movePieceToTile(fromTile: TileComponent, toTile: TileComponent)  {
      toTile.optionalImageSource = fromTile.optionalImageSource;
      toTile.isOccupied = true;
      fromTile.optionalImageSource = '';
      fromTile.isOccupied = false;
      
  }

  highlightGridCells(currentPosition: Piece | undefined, cellsToHighlight: Tile[] | undefined, revert: boolean = false)  { 
    if (!currentPosition)  { return; }
    if (!cellsToHighlight?.length) { return; }
    
    const stringRefs = cellsToHighlight.map(tile => tile.index);
    const elems = new Array();
    for (const idx  of stringRefs)  {
        const element = document.getElementById(idx);
        const className = element?.classList.contains('white') ? 'can-move-here-white' : 'can-move-here-black';
        if (revert)  {
          this.currentlyHighlighted = [];
          element?.classList.remove(className);
        } else {
          this.currentlyHighlighted = cellsToHighlight;
          element?.classList.add(className);
        }
    }
  }

  refreshAllRows(): void  {
    this.rows = [];
    for(let i = 1; i < 9; i++)  {
      const idxStr = `row${i}`;
      this.rows[i - 1] = ( this.game.board.BoardAccess.get(idxStr) as Tile[] );
    }
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.rows = [];
    for(let i = 1; i < 9; i++)  {
      const idxStr = `row${i}`;
      this.rows[i - 1] = ( this.game.board.BoardAccess.get(idxStr) as Tile[] );
    }
  }
}
