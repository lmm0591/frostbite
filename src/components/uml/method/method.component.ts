import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'g[app-method]',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MethodComponent implements OnInit {

  constructor() { }


  @Input()
  name: String;

  ngOnInit(): void {
  }

}
