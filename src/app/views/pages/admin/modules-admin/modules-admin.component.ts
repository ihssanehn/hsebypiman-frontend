import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModuleService } from '@app/core/services/module.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";

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
    var params = {modules: this.modulesList};
    this.moduleService.updateModules(params).subscribe(res=>{
      this.modulesList = res.result.data;
      this.moduleService.getModules().toPromise();
      this.cdr.markForCheck();
    })
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
