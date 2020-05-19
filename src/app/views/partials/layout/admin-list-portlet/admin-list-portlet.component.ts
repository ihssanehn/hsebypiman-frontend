import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'tf-admin-list-portlet',
  templateUrl: './admin-list-portlet.component.html',
  styleUrls: ['./admin-list-portlet.component.scss']
})
export class AdminListPortletComponent implements OnInit {

  @Input()
  item: any;

  @Input()
  sortable: boolean = true;

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
  selectedItem;

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
    this.item.children.push({edit: true, id:"-1"})
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

  dropChild(event: CdkDragDrop<string[]>): void {
    if(this.sortable){
      let data = { id : event.item.data.id, ordre :  event.currentIndex };
      moveItemInArray(this.item.children, event.previousIndex, event.currentIndex);
      if(data.id != -1){this.saveChild(data)};
    }
  }



  startEdit(data: any): void {
    data.old_lib = data.libelle; 
    data.old_activ = data.active;
    data.edit = true;
  }

  cancelEdit(data : any): void {
    if(data.id >= 0){
      data.edit = false;
      data.libelle = data.old_lib; 
      data.active = data.old_activ ;
    }else{
      var idx = this.item.children.map(function(x) {return x.id; }).indexOf(data.id);
      this.item.children.splice(idx, 1);
    }
  }


  toggleVisibility(item){
    if(item.active == 1){
      item.active = 0;
    }else{
      item.active = 1
    };
  }


}
