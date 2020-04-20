import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Type, Status, CatHabilitation } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { TypeService, StatusService, CatHabilitationService } from '@app/core/services';
import { first } from 'rxjs/operators';


@Component({
  selector: 'tf-chantier-form',
  templateUrl: './chantier-form.component.html',
  styleUrls: ['./chantier-form.component.scss']
})
export class ChantierFormComponent implements OnInit {

  types: Type[];
  users: User[];
  status: Status[];
  catHabs: CatHabilitation[];
  showHabs: Boolean = false;

  @Input() chantierForm: FormGroup;
  @Input() edit: Boolean;
  constructor(
    private typeService:TypeService,
    private statusService:StatusService,
    private catHabilitationService:CatHabilitationService,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
    this.getUsers();
    this.getStatus();
    this.getCatHabs();
    this.showHabs = this.chantierForm.get('habilitations').value.length > 0;
  }

  async getTypes(){
    var res = await this.typeService.getAllFromModel('Chantier').toPromise();
    this.types = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    var res = await this.authService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getStatus(){
    var res = await this.statusService.getAllFromModel('Chantier').toPromise();
    this.status = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getCatHabs(){
    var res = await this.catHabilitationService.getAll().toPromise();
    this.catHabs = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  onHabCheckChange(event) {
    const formArray: FormArray = this.chantierForm.get('habilitations') as FormArray;
    if(event.checked){
      formArray.push(new FormControl(event.source.value));
    }
    else{
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.source.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onHabIsChecked(habId){
    return this.chantierForm.get('habilitations').value.includes(habId);
  }
}
