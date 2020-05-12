import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';

@Component({
  selector: 'tf-admin-basic-list-portlet',
  templateUrl: './admin-basic-list-portlet.component.html',
  styleUrls: ['./admin-basic-list-portlet.component.scss']
})
export class AdminBasicListPortletComponent implements OnInit {

  @Input()
  items: any;

  @Output() 
  onSaveItem = new EventEmitter<any>();

  @Output() 
  onRefreshItem = new EventEmitter<any>();

  @Output() 
  onDeleteItem = new EventEmitter<any>();



  constructor() { }

  ngOnInit() {
  }


  saveItem(data : any): void {
    this.onSaveItem.emit( data );
    data.edit = false;
  }

  refreshItem(data : any): void {
    this.onRefreshItem.emit( data );
  }

  
  deleteItem(data : any): void {
    this.onDeleteItem.emit( data );
  }
  


  startEdit(data: any): void {
    data.old  = data.libelle; 
    data.edit = true;
  }

  cancelEdit(data : any): void {
    data.edit = false;
    data.libelle = data.old; 
  }


}
