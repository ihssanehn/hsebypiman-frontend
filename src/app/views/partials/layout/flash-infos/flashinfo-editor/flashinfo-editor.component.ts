import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { environment } from '@env/environment';

@Component({
  selector: 'tf-flashinfo-editor',
  templateUrl: './flashinfo-editor.component.html',
  styleUrls: ['./flashinfo-editor.component.scss']
})
export class FlashinfoEditorComponent implements OnInit {

  @Input() data: any;
  @Output() change = new EventEmitter();
  @ViewChild("editor", {static: true}) editor: any;

  public Editor = Editor;
  public config: any = {
    simpleUpload: {
      uploadUrl: environment.apiBaseUrl + 'flash-infos/upload',
      withCredentials: true, 
      headers: {
        "Entity": `${localStorage.getItem(environment.entity)}`,
        Authorization: `Bearer ${localStorage.getItem(environment.authTokenKey)}`
      }
    }
  };

  constructor() { }

  ngOnInit() {
  }

  onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  onChange({ editor }: ChangeEvent) {
    if(editor) {
      const changes = editor.model.document.differ.getChanges();
      for (const change of changes) {
        if(change.attributeKey == "uploadStatus") {
          switch (change.attributeNewValue) {
            case "uploading":
              this.change.emit(false);
              break;
          
            case "complete":
              this.change.emit(editor.getData());
              break;

            default:
              this.change.emit(editor.getData());
              break;
          }
        } else {
          this.change.emit(editor.getData());
        }
      }
    }
  }

}
