import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Tile } from '../models/game';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})

export class TileComponent implements OnInit, AfterViewInit {

  @ViewChild('thisTile') thisTile: any;

  @Input() tile: Tile;

  @Output() tileClick: EventEmitter<Tile>;

  index: string = '';
  innerHtml: string;
  isOccupied = false;
  optionalImageSource: string = '';

  constructor() {
    this.tile = new Tile("",false);
    this.tileClick = new EventEmitter<Tile>();
    // this.tile = JSON.parse(JSON.stringify(tile));
    this.innerHtml = `<td>${this.tile.index}</td>`;
  }



  onTileClick(evt: any)  {
    // console.log(evt);
    // console.log(this.tile.index);
    /*
    Might need more logic here, might not.
    */
    this.tileClick.emit(evt);
  }



  ngAfterViewInit(): void {
    /* Set DOM Element id to the chess Index */
    this.thisTile.nativeElement.id = this.tile.index;
  }



  ngOnInit(): void
  {
    if (this.tile.currentlyOccupiedBy)  {
      this.index = this.tile.index;
      this.isOccupied = true;
      this.optionalImageSource = `./assets/pieces/${this.tile.currentlyOccupiedBy.FileName}`
    }
  }

}

