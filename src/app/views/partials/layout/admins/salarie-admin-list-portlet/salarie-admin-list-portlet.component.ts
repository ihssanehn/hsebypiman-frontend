import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Injector } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AdminListPortletComponent } from '@app/views/partials/layout/admin-list-portlet/admin-list-portlet.component';

@Component({
  selector: 'salarie-admin-list-portlet',
  templateUrl: './salarie-admin-list-portlet.component.html',
  styleUrls: ['../../../../partials/layout/admin-list-portlet/admin-list-portlet.component.scss']
})
export class SalarieAdminListPortletComponent extends AdminListPortletComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }


  startEdit(data: any): void {
    data.old_lib = data.libelle;
    data.old_unit = data.unit;
    data.old_is_editable = data.is_editable;
    data.old_has_goal = data.has_goal;
    data.old_is_expected_decreasing = data.is_expected_decreasing;
    data.old_is_bool = data.is_bool;


    data.old_activ = data.active;
    data.edit = true;
  }

  cancelEdit(data : any): void {
    if(data.id >= 0){
      data.edit = false;
      data.libelle = data.old_lib; 
      data.unit = data.old_unit; 
      data.is_editable = data.old_is_editable; 
      data.has_goal = data.old_has_goal; 
      data.is_expected_decreasing = data.old_is_expected_decreasing; 
      data.is_bool = data.old_is_bool; 

      data.active = data.old_activ ;
    }else{
      var idx = this.item.children.map(function(x) {return x.id; }).indexOf(data.id);
      this.item.children.splice(idx, 1);
    }
  }

  toggleEditableVisibility(item){
    if(item.is_editable == 1){
      item.is_editable = 0;
    }else{
      item.is_editable = 1
    };
  }

  toggleGoalVisibility(item){
    if(item.has_goal == 1){
      item.has_goal = 0;
    }else{
      item.has_goal = 1
    };
  }

  toggleTypeVisibility(item){
    if(item.is_expected_decreasing == 1){
      item.is_expected_decreasing = 0;
    }else{
      item.is_expected_decreasing = 1
    };
  }

  toggleBoolVisibility(item){
    if(item.is_bool == 1){
      item.is_bool = 0;
    }else{
      item.is_bool = 1
    };
  }

}
