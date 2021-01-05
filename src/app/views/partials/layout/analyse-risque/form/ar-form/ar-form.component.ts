import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { CatRisqueService, EquipementService, ZoneService } from '@app/core/services';
import { CatRisque, Equipement, Zone } from '@app/core/models';
import { User, AuthService } from '@app/core/auth';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { ParseTreeResult } from '@angular/compiler';
import { NgxMaskModule} from 'ngx-mask';
import { FormStatus } from '@app/core/_base/crud/models/form-status';



@Component({
  selector: 'tf-ar-form',
  templateUrl: './ar-form.component.html',
  styleUrls: ['./ar-form.component.scss']
})
export class ArFormComponent implements OnInit {

  @Input() arForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() origin: string;
  @Output() onLastStep: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(SignaturePad,null) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { 
    'minWidth': 5,
    'canvasWidth': 250,
    'canvasHeight': 100
  };
  
  displayedColumns: string[] = ['risks', 'actions', 'comments'];
  public risksList : Array<CatRisque>;
  public zonesList : Array<any>;
  public equipementList : Array<Equipement>;
  public user : User;
  //public curDate : Date;
  toppings = new FormControl();
  toppingList: any[] = [
    {key: 'Lundi', value: 'ARS.DAYS.MON'}, 
    {key: 'Mardi', value: 'ARS.DAYS.TUE'}, 
    {key: 'Mercredi', value: 'ARS.DAYS.WED'}, 
    {key: 'Jeudi', value: 'ARS.DAYS.THU'}, 
    {key: 'Vendredi', value: 'ARS.DAYS.FRI'}, 
    {key: 'Samedi', value: 'ARS.DAYS.SAT'}, 
    {key: 'Dimanche', value: 'ARS.DAYS.SUN'}
  ];
  public parts = [1];
  public salaries : Array<User>;
  filteredSalaries: Observable<Array<User>>;

  constructor(
    private catRisqueService: CatRisqueService,
    private equipementService: EquipementService,
    private zoneService: ZoneService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { 
    this.getCatRisques();
    this.getEquipements();
    this.getZones();
  }

  ngOnInit() {
    this.toppings = this.arForm.controls['accueil_secu_days'] as FormControl;
  }

  async getCatRisques(){
    var res = await this.catRisqueService.getAll().toPromise();
    this.risksList = res.result.data;
    this.cdr.markForCheck();
  }

  async getZones(){
    var res = await this.zoneService.getList().toPromise();
    this.zonesList = res.result.data;
    this.cdr.markForCheck();
  }

  async getEquipements(){
    var res = await this.equipementService.getAll().toPromise();
    this.equipementList = res.result.data;
    this.cdr.markForCheck();
  }


  onRiskCheckChange(event, actions) {
    const risksFormArray: FormArray = this.arForm.get('risques') as FormArray;
    const catRisksformArray: FormArray = this.arForm.get('cat_risques') as FormArray;

    this.manageRisksSelection(event.source.value, event.checked, catRisksformArray);

    actions.forEach(element => {
      this.manageRisksSelection(element.id, event.checked, risksFormArray);
    });
  }

  manageRisksSelection(idRisk: number, checked: boolean, formArray: FormArray){
    /* Selected */
    if(checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(idRisk));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;
  
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == idRisk) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  onEquipementCheckChange(event) {
    const formArray: FormArray = this.arForm.get('equipements') as FormArray;
  
    /* Selected */
    if(event.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.source.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;
  
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.source.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  onZoneCheckChange(event) {
    const formArray: FormArray = this.arForm.get('zones') as FormArray;
  
    /* Selected */
    if(event.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.source.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;
  
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.source.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  onRiskIsChecked(riskId){
    return this.arForm.get('cat_risques').value.includes(riskId);
  }

  onEquipementIsChecked(equipementId){
    return this.arForm.get('equipements').value.includes(equipementId);
  }

  onZoneIsChecked(zoneId){
    return this.arForm.get('zones').value.includes(zoneId);
  }

  onCommentCheckChange(id, event) {

    const formArray: FormArray = this.arForm.get('comments') as FormArray;

    this.removeRisqueComments(id, formArray);

    if(event.target.value){

      const commentGroup: FormGroup = this.fb.group({
        'cat_risque_id': id,
        'commentaire': event.target.value
      });

      formArray.push(commentGroup);
    }else{
      console.log(event.target);
    }
    console.log(formArray.value);
  }

  removeRisqueComments(id, formArray: FormArray){
    let i: number = 0;
    formArray.controls.forEach((ctrl: FormGroup) => {
      if(ctrl.controls.cat_risque_id.value == id) {
        formArray.removeAt(i);
        return;
      }

      i++;
    });
  }

  getCommentValue(id){
    var commentValue = '';
    const formValue = this.arForm.get('comments').value;
    formValue.forEach(element => {
      if(element.cat_risque_id == id){
        commentValue = element.commentaire;
      }
    });

    return commentValue;
  }
  partHided(key){
    return !this.parts.includes(key);
  }
  showPart(key){
    if(!this.parts.includes(key)){
      this.parts.push(key);
    }
    if(key == 4){
      this.onLastStep.emit(true);
    }
  }
  isChecked(controlName: string){
    return this.arForm.get(controlName).value == '1';
  }

  isFieldRequired(controlName){
    if(this.arForm && this.arForm.controls[controlName]){
      const control = this.arForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.arForm.controls[controlName];
		if (!control) {
			return false;
		}
    return control.hasError(validationType) && (control.dirty || control.touched);
  }
  
  updateToggleValue(event, controlName){
    if(event.checked){
      this.arForm.controls[controlName].setValue('1');
    }else{
      this.arForm.controls[controlName].setValue('0');
    }
  }
}
