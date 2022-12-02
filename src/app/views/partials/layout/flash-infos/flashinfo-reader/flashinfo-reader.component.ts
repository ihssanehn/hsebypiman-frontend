import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'tf-flashinfo-reader',
  templateUrl: './flashinfo-reader.component.html',
  styleUrls: ['./flashinfo-reader.component.scss']
})
export class FlashinfoReaderComponent implements OnInit {

  @Input() data: any;

  public Editor = Editor;
  public config: any = {
    isReadOnly: true, 
    toolbar: [],
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

}
