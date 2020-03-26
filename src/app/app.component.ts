import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { editor as Editor } from "monaco-editor";
import { TypescriptParser, ClassDeclaration } from '../lib/ts-parser';
import { UmlService } from '../components/uml/uml.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  classDeclarations = [];
  editor: Editor.ICodeEditor;
  options = {
    theme: 'vs-dark',
    automaticLayout: true,
  };

  model: NgxEditorModel = {
    value: `class ClassAnimal {
      
      age:number = 1;

      address: string = ''

      public method1() {

      }

      public method2(): void {

      }


      public method3(): void {

      }


      public method4(): void {

      }
  }

  class ClassDog extends ClassAnimal {
      public method11() {

      }
  }`,
    language: 'typescript'
  };



  constructor(private ngZone: NgZone, private umlService: UmlService) { }

  async parseCode(code: string) {
    const typescriptParser = new TypescriptParser();
    const tsFile = await typescriptParser.parseSource(code)
    this.ngZone.run(() => {
      this.classDeclarations = tsFile.declarations.filter(declaration => {
        return declaration instanceof ClassDeclaration
      }) as ClassDeclaration[];

      // console.log('this.basicMenu: ', this.basicMenu);
      console.log('this.classDeclarations: ', this.classDeclarations);
    })
  }

  async handleInit(editor: Editor.ICodeEditor) {
    const code = editor.getValue()
    this.umlService.codeEditor = editor
    await this.parseCode(code)
    editor.onDidChangeModelContent(async () => {
      await this.parseCode(editor.getValue())
    })
  }

  translate(x: Number, y: Number) {
    return `translate(${x}, ${y})`
  }

  ngOnInit() {

  }

}
