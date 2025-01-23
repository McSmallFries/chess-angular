import { Component, EventEmitter, OnInit, Output } from '@angular/core';import $ from 'jquery';

@Component({
  selector: 'app-popover-menu',
  templateUrl: './popover-menu.component.html',
  styleUrls: ['./popover-menu.component.scss']
})
export class PopoverMenuComponent implements OnInit {

  @Output() onMenuItemClick: EventEmitter<string>;

  constructor() { 
    this.onMenuItemClick = new EventEmitter<string>();
  }

  ngOnInit(): void {
  }

  onButtonClick(params: any, option: string)  {
      this.onMenuItemClick.emit(option);
  }
}
