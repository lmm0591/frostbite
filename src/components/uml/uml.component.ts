import { Component, OnInit, Input } from '@angular/core';
import { ClassDeclaration } from 'src/lib/ts-parser';
import { ClassItem } from './model/ClassItem';
import { Point } from './model/Point';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';

@Component({
  selector: 'app-uml',
  templateUrl: './uml.component.html',
  styleUrls: ['./uml.component.scss']
})
export class UmlComponent implements OnInit {

  constructor() { }

  @Input()
  set classDeclarations(classDeclarations: ClassDeclaration[]){
    const CLASS_DECLARATION_MAP = groupBy(this.classItems, 'classDeclaration.name')
    this.classItems = classDeclarations.map((classDeclaration, index) => {
      const existClassItem = get(CLASS_DECLARATION_MAP[classDeclaration.name], '[0]')
      if(existClassItem){
        existClassItem.classDeclaration = classDeclaration
        return existClassItem
      } else {
        const classItem = new ClassItem()
        classItem.classDeclaration = classDeclaration
        classItem.point = new Point(0, index * 200)
        return classItem
      }
    })
  }

  classItems: ClassItem[] = []

  ngOnInit(): void {
  }

  translate(x:Number, y: Number){
    return `translate(${x}, ${y})`
  }

  cdkDragHandle({ distance }, classItem: ClassItem){
    classItem.point.x = distance.x
    classItem.point.y = distance.y
  }
}
