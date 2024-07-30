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
  // uiRows: TileComponent[][];

  constructor(private game: GameService) {
    // this.uiRows = [[]];
    this.rows =  [[]];
  }

  onTileClick(tile: Tile)  {
    console.log(tile);
    const tilesClicked = this.game.tileClicks.$_TileClicks.getValue();
    const firstTile = tilesClicked[0];
    const tileClicks = (firstTile) ? [firstTile, tile] as Tile[] : [tile] as Tile[];
    this.game.tileClicks.$_TileClicks.next(tileClicks);
    if (tileClicks?.length === 1)  {
       const tile = this.game.tileClicks.$_TileClicks.getValue()[0];
       const validMoves = tile?.currentlyOccupiedBy?.CanMoveToTiles;
       this.highlightGridCells(tile?.currentlyOccupiedBy, validMoves)
    }
  }

  highlightGridCells(currentPosition: Piece | undefined, cellsToHighlight: Tile[] | undefined)  { 
    if (!currentPosition)  { return; }
    if (!cellsToHighlight?.length) { return; }
    
    const stringRefs = cellsToHighlight.map(tile => tile.index);
    const elems = new Array();
    for (const idx  of stringRefs)  {
        const element = document.getElementById(idx);
        const className = element?.classList.contains('white') ? 'can-move-here-white' : 'can-move-here-black';
        element?.classList.add(className);
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
