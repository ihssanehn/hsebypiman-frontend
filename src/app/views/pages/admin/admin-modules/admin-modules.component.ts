import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModuleService } from '@app/core/services/module.service';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';;
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-admin-modules',
  templateUrl: './admin-modules.component.html',
  styleUrls: ['./admin-modules.component.scss']
})
export class AdminModulesComponent implements OnInit {

  constructor(
    private moduleService:ModuleService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ){
  }

  formloading: boolean = false;
  formStatus = new FormStatus();

  modulesList: any;

  ngOnInit() {
    this.getAllModules();
  }

  getAllModules(){
    this.moduleService.getModulesAsAdmin().subscribe(res=>{
      this.modulesList = res.result.data;
      this.cdr.markForCheck();
    })
  }

  onSubmit(){
    this.formloading = true;
    var params = {modules: this.modulesList};
    this.moduleService.updateModules(params).toPromise()
    .then(res=>{
      this.modulesList = res.result.data;
      this.moduleService.getModules().toPromise();
      Swal.fire({
        icon: 'success',
        title: this.translate.instant("MODULE.NOTIF.MODULE_UPDATED.TITLE"),
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
        this.formloading = false;
        this.cdr.markForCheck();
      })
    }).catch(err =>{ 
      this.formloading = false;
      this.cdr.markForCheck();

      Swal.fire({
        icon: 'error',
        title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
        showConfirmButton: false,
        timer: 1500
      });

      if(err.status === 422){
        var messages = extractErrorMessagesFromErrorResponse(err);
        this.formStatus.onFormSubmitResponse({success: false, messages: messages});
        this.cdr.markForCheck();
      }

    });
  }
  
  onModuleCheckChange(event, modId) {
    if(event.checked){
      this.modulesList.filter(x => x.id == modId)[0].is_active = 1
    }else{
      this.modulesList.filter(x => x.id == modId)[0].is_active = 0
    }
  }  

  cancelForm(){
    this.getAllModules();
  }
}
