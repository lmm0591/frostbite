import { Position } from './Position';
import { ClassDeclaration } from 'src/lib/ts-parser';
import { Rect } from './Rect';
import { Direction } from './Direction';


const ITEM_HEIGHT = 20
export class ClassItem  {

  classDeclaration: ClassDeclaration;

  get rect(): Rect {
    let propertyHeight = 0
    let methodHeight = 0
    if(this.classDeclaration.properties.length){
      propertyHeight = this.classDeclaration.properties.length * ITEM_HEIGHT + ITEM_HEIGHT
    }

    if(this.classDeclaration.methods.length){
      methodHeight = this.classDeclaration.methods.length * ITEM_HEIGHT + ITEM_HEIGHT
    }
    const height = propertyHeight + methodHeight + 40 +2
    const width = 150
    return new Rect(width, height, this.startPosition)
  }

  get endPosition(): Position {
    const x = this.startPosition.x + this.rect.width;
    const y = this.startPosition.y + this.rect.height;
    return new Position(x, y);
  }

  constructor(public startPosition: Position = new Position()){}

  getDirectionPoint(direction: Direction): Position {
    if (direction === Direction.E) {
      return new Position(this.endPosition.x, this.startPosition.y + this.rect.height / 2)
    } else if (direction === Direction.S) {
      return new Position(this.startPosition.x + this.rect.width / 2,this.startPosition.y + this.rect.height)
    } else if (direction === Direction.W) {
      return new Position(this.startPosition.x, this.startPosition.y + this.rect.height / 2)
    }
    return new Position(this.startPosition.x + this.rect.width / 2, this.startPosition.y)
  }
}
