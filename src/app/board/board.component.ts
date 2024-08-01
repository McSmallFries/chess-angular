import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { TileComponent } from '../tile/tile.component';
import {ClickRole, Piece, Tile} from '../models/game';



@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})

export class BoardComponent implements OnInit, AfterViewInit {

  @ViewChild('uiBoardRoot') uiBoardRoot: HTMLTableElement | undefined;

  rows: Tile[][];
  currentlyHighlighted: Tile[];

  constructor(private game: GameService) {
    this.rows =  [[]];
    this.currentlyHighlighted = new Array<Tile>();
  }

  onTileClick(component: TileComponent)  {
    const tilesClicked = this.game.tileClicks.$_TileClicks.getValue();
    const firstTile = tilesClicked[0] as TileComponent;
    const tileClicks = (firstTile) ? [firstTile, component] as TileComponent[] : [component] as TileComponent[];
    this.game.tileClicks.$_TileClicks.next(tileClicks);

    if (tileClicks?.length === ClickRole.FIRST_CLICK)  {
       const tile = this.game.tileClicks.$_TileClicks.getValue()[0];
       const validMoves = tile?.tile.currentlyOccupiedBy?.CanMoveToTiles;
       this.highlightGridCells(tile?.tile.currentlyOccupiedBy, validMoves);
    }

    if (tileClicks.length === ClickRole.SECOND_CLICK)  {
      const fromTile = tileClicks[0];
      const toTile = tileClicks[1];
      const validMove = this.currentlyHighlighted
        .map(t => t.index)
          .includes(toTile.tile.index) && !toTile.isOccupied;
          debugger;
      if (validMove)  {
        this.movePieceToTile(fromTile, toTile);
      }
      this.highlightGridCells(this.game.SubjectPiece, this.currentlyHighlighted, true);
      this.game.setSubjectPieceAndTile(undefined, new Tile());
      this.game.tileClicks.$_TileClicks.next([]);
    }
  }



  movePieceToTile(fromTile: TileComponent, toTile: TileComponent)  {
      this.game.SubjectPiece!.CurrentPosition = toTile.tile.index;
      toTile.optionalImageSource = fromTile.optionalImageSource;
      toTile.isOccupied = true;
      toTile.tile.currentlyOccupiedBy = this.game.SubjectPiece;
      fromTile.optionalImageSource = '';
      fromTile.isOccupied = false;
      fromTile.tile.currentlyOccupiedBy = undefined
  }



  highlightGridCells(currentPosition: Piece | undefined, cellsToHighlight: Tile[] | undefined, revert: boolean = false)  {
    if (!currentPosition)  { return; }
    if (!cellsToHighlight?.length) { return; }
    debugger;
    const stringRefs = cellsToHighlight.map(tile => tile.index);
    for (const idx  of stringRefs)  {
        const tile = this.game.board.BoardState.get(idx) as Tile;
        tile.isHighlighted = !revert;
        this.game.board.BoardState.set(idx, tile);
        this.currentlyHighlighted.push(tile);
    }
    if (revert)  {
      this.currentlyHighlighted = [];
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

