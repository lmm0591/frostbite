import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AppComponent } from './app.component';
import { ClassComponent } from '../components/uml/class/class.component';
import { MethodComponent } from '../components/uml/method/method.component';
import { MethodsComponent } from '../components/uml/methods/methods.component';
import { UmlComponent } from '../components/uml/uml.component';
import { LineComponent } from '../components/uml/line/line.component';

export function onMonacoLoad() {

  const uri = monaco.Uri.parse('a://b/foo.json');
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [{
      uri: 'http://myserver/foo-schema.json',
      fileMatch: [uri.toString()],
      schema: {
        type: 'object',
        properties: {
          p1: {
            enum: ['v1', 'v2']
          },
          p2: {
            $ref: 'http://myserver/bar-schema.json'
          }
        }
      }
    }, {
      uri: 'http://myserver/bar-schema.json',
      fileMatch: [uri.toString()],
      schema: {
        type: 'object',
        properties: {
          q1: {
            enum: ['x1', 'x2']
          }
        }
      }
    }]
  });

}

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets',
  defaultOptions: { scrollBeyondLastLine: false },
  onMonacoLoad
};

@NgModule({
  declarations: [
    AppComponent,
    ClassComponent,
    MethodComponent,
    MethodsComponent,
    UmlComponent,
    LineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    ContextMenuModule.forRoot(),
    MonacoEditorModule.forRoot(monacoConfig)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
