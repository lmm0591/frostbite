import { Position } from './Position';

export class Rect {
  constructor(public width: number = 0, public height: number = 0, public position: Position) { }

  get joinPoint() {
    return {
      top: new Position(this.position.x + this.width / 2, this.position.y),
      right: new Position(this.position.x + this.width, this.position.y + this.height / 2),
      bottom: new Position(this.position.x + this.width / 2, this.position.y + this.height),
      left: new Position(this.position.x, this.position.y + this.height / 2),
    }
  }

  get NWPoint(): Position {
    return new Position(this.position.x, this.position.y)
  }

  get NEPoint(): Position {
    return new Position(this.position.x + this.width, this.position.y)
  }

  get SWPoint(): Position {
    return new Position(this.position.x, this.position.y + this.height)
  }

  get SEPoint(): Position {
    return new Position(this.position.x+ this.width, this.position.y + this.height)
  }

}
