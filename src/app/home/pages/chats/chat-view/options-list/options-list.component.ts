import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-list',
  templateUrl: './options-list.component.html',
  styleUrls: ['./options-list.component.scss'],
})
export class OptionsListComponent implements OnInit {

  @Input() options: any[];

  constructor() { }

  ngOnInit() {}

}
