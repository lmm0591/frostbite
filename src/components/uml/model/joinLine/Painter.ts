import uniq from 'lodash/uniq';
import get from 'lodash/get'
import aStar from 'a-star'
import { Polygon } from 'detect-collisions'
import { ClassItem } from '../ClassItem'
import { Position } from '../Position'

const MARGIN = 10


const rectilinearDistance = function(startPoint, endPoint) {
  const dx = endPoint.x - startPoint.x, dy = endPoint.y - startPoint.y;
  return Math.abs(dx) + Math.abs(dy);
};

var euclideanDistance = function(startPoint, endPoint) {
  const dx = endPoint.x - startPoint.x, dy = endPoint.y - startPoint.y;
  const isCorner = dx && dy
  return Math.sqrt(dx * dx + dy * dy) + isCorner ? 0.01 : 0
};

const planarNeighbors = ([x, y], gridPath,sourceRect, targetRect) => {
  const startLinePosition = get(gridPath, `${y}.${x}`, false)
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1]
  ].filter(([neighborX, neighborY]) => {
    const endLinePosition = get(gridPath, `${neighborY}.${neighborX}`, false)
    if(endLinePosition){
      const targetPolygon = new Polygon(0, 0, [
        [targetRect.NWPoint.x - MARGIN, targetRect.NWPoint.y - MARGIN],
        [targetRect.NEPoint.x + MARGIN, targetRect.NEPoint.y - MARGIN],
        [targetRect.SEPoint.x + MARGIN, targetRect.SEPoint.y + MARGIN],
        [targetRect.SWPoint.x - MARGIN, targetRect.SWPoint.y + MARGIN]
      ]);
      const startPolygon = new Polygon(0, 0, [
        [sourceRect.NWPoint.x - MARGIN, sourceRect.NWPoint.y - MARGIN],
        [sourceRect.NEPoint.x + MARGIN, sourceRect.NEPoint.y - MARGIN],
        [sourceRect.SEPoint.x + MARGIN, sourceRect.SEPoint.y + MARGIN],
        [sourceRect.SWPoint.x - MARGIN, sourceRect.SWPoint.y + MARGIN]
      ]);
      const line = new Polygon(0, 0, [[startLinePosition.x, startLinePosition.y], [endLinePosition.x, endLinePosition.y]]);
      return !line.collides(targetPolygon) && !line.collides(startPolygon)
    }
    return false
  })
};


export class Painter {
  constructor(public source: ClassItem, public target: ClassItem) {}

  get gridPath():  Position[][] {
    const sourceTable = this.getTable(this.source)
    const targetTable = this.getTable(this.target)
    const columns = uniq(sourceTable.column.concat(targetTable.column).sort((a,b) => a - b))
    const rows = uniq(sourceTable.row.concat(targetTable.row).sort((a,b) => a - b))
    return rows.map(row => columns.map(column => new Position(column, row))) as Position[][]
  }

  get joinPoint(): Position[] {
    const joinPointStart = this.source.rect.joinPoint.top
    joinPointStart.y -= MARGIN
    const joinPointEnd = this.target.rect.joinPoint.bottom
    joinPointEnd.y += MARGIN
    const gridPath = this.gridPath


    const gridStart = this.getGridXYByPosition(joinPointStart)
    const gridEnd  = this.getGridXYByPosition(joinPointEnd)
    const results = aStar({
      start: [gridStart.x, gridStart.y],
      isEnd: ([x, y]) => gridEnd.x === x && gridEnd.y === y,
      neighbor: (xy) => {
        return planarNeighbors(xy, gridPath, this.source.rect, this.target.rect)
      },
      distance: (start, end) => {
        return euclideanDistance(gridPath[start[1]][start[0]], gridPath[end[1]][end[0]])
      },
      heuristic: (xy) => {
        return rectilinearDistance(gridPath[xy[1]][xy[0]], joinPointEnd);
      },
    });
    let path = []
    if(results.status === 'success'){
      path = results.path.map((xy) => {
        const { x, y } = this.gridPath[xy[1]][xy[0]]
        return new Position(x, y)
      })
    }
    return [this.source.rect.joinPoint.top, ...path, this.target.rect.joinPoint.bottom]
  }

  getGridXYByPosition(point: Position): Position {
    let gridPosition: Position
    this.gridPath.some((positions, gridY) => positions.some(({x, y}, gridX) => {
      if(x === point.x && y === point.y){
        gridPosition = new Position(gridX, gridY)
        return true
      }
    }))
    return gridPosition
  }

  private getTable(item: ClassItem){
    const column = [
      item.startPosition.x - MARGIN,
      item.startPosition.x + item.rect.width / 2,
      item.endPosition.x + MARGIN
    ]
    const row = [
      item.startPosition.y - MARGIN,
      item.startPosition.y + item.rect.height / 2,
      item.endPosition.y + MARGIN
    ]
    return {
      column,
      row
    }
  }

}
