import { Injectable } from '@angular/core';
import { editor as Editor, IRange } from 'monaco-editor';
import { PropertyDeclaration, MethodDeclaration } from 'src/lib/ts-parser';

@Injectable({
  providedIn: 'root'
})
export class UmlService {

  constructor() { }

  codeEditor: Editor.ICodeEditor
  selectedItem: MethodDeclaration | PropertyDeclaration
  
  startEndToRange(start: number, end: number): IRange {
    let startLineNumber = 1
    let startColumn = 0
    let endLineNumber = 1
    let endColumn = 0
    let total = 0
    
    this.codeEditor.getValue().split(/\n/g).some(text => {
      if (start < (total + text.length)) {
        startColumn = start - total + 2
        endColumn = end - total + 1
        endLineNumber = startLineNumber
        text.substring(startColumn, endColumn)
        return true
      }
      ++startLineNumber
      total += (text.length + 1)
    })
    return {
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn
    }
  }

  setSelection(start: number, end: number) {
    this.codeEditor.setSelection(this.startEndToRange(start, end))
    this.codeEditor.focus()
  }
}
