import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'g[app-methods]',
  templateUrl: './methods.component.html',
  styleUrls: ['./methods.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MethodsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
