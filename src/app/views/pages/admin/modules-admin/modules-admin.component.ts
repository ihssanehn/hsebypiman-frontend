import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModuleService } from '@app/core/services/module.service';
import { Router, ActivatedRoute } from '@angular/router';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';;
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-modules-admin',
  templateUrl: './modules-admin.component.html',
  styleUrls: ['./modules-admin.component.scss']
})
export class ModulesAdminComponent implements OnInit {

  constructor(
    private moduleService:ModuleService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
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
      this.cdr.markForCheck();
      Swal.fire({
        icon: 'success',
        title: 'Modules mis à jour avec succès',
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
        this.formloading = false;
      })
    }).catch(err =>{ 
      this.formloading = false;

      Swal.fire({
        icon: 'error',
        title: 'Echec! le formulaire est incomplet',
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
