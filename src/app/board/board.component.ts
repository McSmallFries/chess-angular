import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { TileComponent } from '../tile/tile.component';
import {ClickRole, Piece, Tile} from '../models/game';
import { Subject } from 'rxjs';



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
    const isSameClick = component.tile.index === firstTile?.tile?.index;
    if (isSameClick || (isSameClick && !component.isOccupied)) return this.neutralizeBoard();
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
      const wantsToTake = toTile.isOccupied && (toTile.tile.currentlyOccupiedBy?.IsWhite !== fromTile.tile?.currentlyOccupiedBy);
      const isBlockedBySelf = toTile.tile.currentlyOccupiedBy?.IsWhite !== fromTile.tile.currentlyOccupiedBy?.IsWhite;
      const validMove = this.currentlyHighlighted
        .map(t => t.index)
          .includes(toTile.tile.index) && isBlockedBySelf;
          
      if (validMove && !wantsToTake)  {
        this.movePieceToTile(fromTile, toTile);
      } else if (validMove && wantsToTake)  {
        this.movePieceToTile(fromTile, toTile);
      }
      this.neutralizeBoard();
    }


  }

  neutralizeBoard(withSubjectPiece?: Piece)  {
    let tile = undefined;
    if (withSubjectPiece)  {
       tile = this.game.board.BoardState.get(withSubjectPiece.CurrentPosition);
    }
    this.game.tilesUnderAttack.forEach(this.game.unhighlightUnderAttackTiles);
    this.highlightGridCells(this.game.SubjectPiece, this.currentlyHighlighted, true);
    this.game.setSubjectPieceAndTile(withSubjectPiece, tile);
    this.game.tileClicks.$_TileClicks.next([]);
  }

  movePieceToTile(fromTile: TileComponent, toTile: TileComponent)  {
      const takenPiece = toTile.tile.currentlyOccupiedBy?.PieceName
      this.game.board.StoreMove(this.game.SubjectPiece as Piece, fromTile.tile, toTile.tile, takenPiece);
      this.game.SubjectPiece!.CanMoveToTiles = new Array<Tile>();
      this.game.SubjectPiece!.CurrentPosition = toTile.tile.index;
      toTile.optionalImageSource = fromTile.optionalImageSource;
      toTile.isOccupied = true;
      toTile.tile.currentlyOccupiedBy = this.game.SubjectPiece;
      fromTile.optionalImageSource = '';
      fromTile.isOccupied = false;
      fromTile.tile.currentlyOccupiedBy = undefined;
  }



  highlightGridCells(currentPosition: Piece | undefined, cellsToHighlight: Tile[] | undefined, revert: boolean = false)  {
    if (!currentPosition)  { return; }
    if (!cellsToHighlight?.length) { return; }

    const stringRefs = new Set(cellsToHighlight.map(tile => tile.index));
    for (const idx  of stringRefs)  {
        const tile = this.game.board.BoardState.get(idx) as Tile;
        tile.isHighlighted = !revert;
        this.game.board.BoardState.set(idx, tile);
        this.currentlyHighlighted.push(tile);
    }
    if (revert)  {
      this.currentlyHighlighted = [];
      this.refreshAllRows();
    }
  }

  refreshAllRows(): void  {
    this.rows = [];
    for(let i = 1; i < 9; i++)  {
      const idxStr = `row${i}`;
      const tileRow = this.game.board.BoardAccess.get(idxStr) as Tile[];
      // tileRow.forEach(tile => tile.isHighlighted = false);
      this.rows[i - 1] = ( tileRow );
    }
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit not implemented.") // TODO remove
  }

  ngOnInit(): void {
    this.rows = [];
    for(let i = 1; i < 9; i++)  {
      const idxStr = `row${i}`;
      this.rows[i - 1] = ( this.game.board.BoardAccess.get(idxStr) as Tile[] );
    }
  }
}

