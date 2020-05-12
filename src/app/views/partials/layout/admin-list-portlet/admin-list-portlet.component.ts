import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';

@Component({
  selector: 'tf-admin-list-portlet',
  templateUrl: './admin-list-portlet.component.html',
  styleUrls: ['./admin-list-portlet.component.scss']
})
export class AdminListPortletComponent implements OnInit {

  @Input()
  item: any;

  @Output() 
  onSaveItem = new EventEmitter<any>();

  @Output() 
  onRefreshItem = new EventEmitter<any>();

  @Output() 
  onDeleteItem = new EventEmitter<any>();

  @Output() 
  onAddChild = new EventEmitter<any>();

  @Output() 
  onSaveChild = new EventEmitter<any>();

  @Output() 
  onDeleteChild = new EventEmitter<any>();

  collapsed : boolean = false;

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
  
  
  addChild(){
    this.item.children.push({edit: true})
    // this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(10);
  }

  saveChild(data : any): void {
    if(!data.id)
      this.onAddChild.emit( { ...data, parent_id : this.item.id} );
    else
      this.onSaveChild.emit( data );
    data.edit = false;
  }

  deleteChild(data : any): void {
    this.onDeleteChild.emit( { ...data, parent_id : this.item.id} );
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
