import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
    @Input() isSelected: boolean = false;
    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    toggleOnChange(params: any)  {
        this.onChange.emit(this.isSelected);
    }

}