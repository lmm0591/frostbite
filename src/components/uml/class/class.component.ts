import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { PropertyDeclaration, MethodDeclaration } from 'src/lib/ts-parser';
import { ClassItem } from '../model/ClassItem';
import { UmlService } from '../uml.service';

@Component({
  selector: 'g[app-class]',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {

  constructor(private zoon: NgZone, private umlService: UmlService){}

  @ViewChild('wrap', { static: true })
  wrapRef: ElementRef<HTMLDivElement>;

  @Input()
  classItem: ClassItem;

  selected: MethodDeclaration | PropertyDeclaration

  ngOnInit(): void {
  }

  selectProperty(propertyDeclaration: MethodDeclaration){
    this.selected = propertyDeclaration
    this.umlService.setSelection(propertyDeclaration.nameRange.start, propertyDeclaration.nameRange.end)
  }

}
