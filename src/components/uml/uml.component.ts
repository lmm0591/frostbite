import { Component, OnInit, Input } from '@angular/core';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import { ClassDeclaration } from 'src/lib/ts-parser';
import { ClassItem } from './model/ClassItem';
import { Position } from './model/Position';
import { UmlService } from './uml.service';

@Component({
  selector: 'app-uml',
  templateUrl: './uml.component.html',
  styleUrls: ['./uml.component.scss']
})
export class UmlComponent implements OnInit {

  dragStartPoint: Position = new Position();

  constructor(public umlService: UmlService) { }

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
        classItem.rect.position = new Position(0, index * 400)
        return classItem
      }
    })
    this.umlService.classItems = this.classItems
  }

  get joinLines() {
    return this.classItems.filter(classItem => classItem.classDeclaration.superClassDeclaration).map(classItem => {
      return {
        source: classItem,
        target: this.umlService.getClassItemByClassName(classItem.classDeclaration.superClassDeclaration.name)
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
    classItem.rect.position.x = this.dragStartPoint.x + distance.x
    classItem.rect.position.y = this.dragStartPoint.y + distance.y
  }

  cdkDragStarted(classItem: ClassItem){
    this.dragStartPoint.x = classItem.rect.position.x
    this.dragStartPoint.y = classItem.rect.position.y
  }
}
