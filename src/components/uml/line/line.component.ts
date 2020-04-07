import { Component, OnInit, Input } from '@angular/core';
import flatten from 'lodash/flatten';
import { ClassItem } from '../model/ClassItem';
import { Direction } from '../model/Direction';
import { Position } from '../model/Position';
import { Painter } from '../model/joinLine/Painter';

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

  get linePoints(): String {
    const painter = new Painter(this.source, this.target)
    return painter.joinPoint.map(({x, y}) => [x, y]).join(' ')
  }

  get pathPoints(): Position[]{
    const painter = new Painter(this.source, this.target)
    return flatten(painter.gridPath)
  }

  ngOnInit(): void {}



}
