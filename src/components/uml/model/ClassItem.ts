import { Point } from './Point';
import { ClassDeclaration } from 'src/lib/ts-parser';

export class ClassItem {
  point: Point = new Point();
  classDeclaration: ClassDeclaration;
}
