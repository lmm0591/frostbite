import { Component, OnInit, Input } from '@angular/core';
import { ClassItem } from '../model/ClassItem';
import { Direction } from '../model/Direction';
import { Point } from '../model/Point';

@Component({
  selector: 'g[app-line]',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  constructor() { }


  @Input()
  source: ClassItem

  @Input()
  target: ClassItem

  get sourcePoint(): Point{
    return this.source.getDirectionPoint(Direction.N)
  }

  get targetPoint(): Point{
    return this.target.getDirectionPoint(Direction.S)
  }

  ngOnInit(): void {}



}
