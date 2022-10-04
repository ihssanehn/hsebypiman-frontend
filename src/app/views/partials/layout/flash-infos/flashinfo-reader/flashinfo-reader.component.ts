import { Component, Input, OnInit } from '@angular/core';
import Editor from "@asset/js/global/integration/plugins/ckeditor/ckeditor";

@Component({
  selector: 'tf-flashinfo-reader',
  templateUrl: './flashinfo-reader.component.html',
  styleUrls: ['./flashinfo-reader.component.scss']
})
export class FlashinfoReaderComponent implements OnInit {

  public Editor = Editor;

  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
