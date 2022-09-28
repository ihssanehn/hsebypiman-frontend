import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Editor from "@asset/js/global/integration/plugins/ckeditor/ckeditor";
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

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
      const data = editor.getData();
      this.change.emit(data);
    }
  }

}
