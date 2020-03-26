import { Point } from './Point';
import { ClassDeclaration } from 'src/lib/ts-parser';
import { Rect } from './Rect';
import { Direction } from './Direction';

const ITEM_HEIGHT = 20
export class ClassItem {
  point: Point = new Point();
  classDeclaration: ClassDeclaration;

  constructor(){}

  get rect(): Rect {
    const height = this.classDeclaration.properties.length * ITEM_HEIGHT + ITEM_HEIGHT + this.classDeclaration.methods.length * ITEM_HEIGHT + ITEM_HEIGHT + 40 +2
    const width = 150
    return new Rect(width, height)
  }

  get endPoint() {
    const x = this.point.x + this.rect.width;
    const y = this.point.y + this.rect.height;
    return new Point(x, y);
  }

  getDirectionPoint(direction: Direction): Point {
    if (direction === Direction.E) {
      return new Point(this.endPoint.x, this.point.y + this.rect.height / 2)
    } else if (direction === Direction.S) {
      return new Point(this.point.x + this.rect.width / 2,this.point.y + this.rect.height)
    } else if (direction === Direction.W) {
      return new Point(this.point.x, this.point.y + this.rect.height / 2)
    }
    return new Point(this.point.x + this.rect.width / 2, this.point.y)
  }
}
