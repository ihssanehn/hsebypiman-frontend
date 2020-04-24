import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { CatRisqueService, EquipementService, ZoneService } from '@app/core/services';
import { CatRisque, Equipement, Zone } from '@app/core/models';
import { User, AuthService } from '@app/core/auth';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { ParseTreeResult } from '@angular/compiler';


@Component({
  selector: 'tf-ar-form',
  templateUrl: './ar-form.component.html',
  styleUrls: ['./ar-form.component.scss']
})
export class ArFormComponent implements OnInit {

  @Input() arForm: FormGroup;
  @Input() edit: Boolean;
  @Input() origin: string;
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
  toppingList: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
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
    //this.curDate = new Date();
  }

  ngOnInit() {
    this.toppings = this.arForm.controls['accueil_secu_days'] as FormControl;
    console.log(this.origin);
  }

  async getCatRisques(){
    var res = await this.catRisqueService.getAll().toPromise();
    this.risksList = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getZones(){
    var res = await this.zoneService.getList().toPromise();
    this.zonesList = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getEquipements(){
    var res = await this.equipementService.getAll().toPromise();
    this.equipementList = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getCurrentUser(){
    var res = await this.authService.getUserByToken().toPromise();
    this.user = res.result.data;
    console.log(this.user);
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  onRiskCheckChange(event) {
    const formArray: FormArray = this.arForm.get('risques') as FormArray;
  
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
    return this.arForm.get('risques').value.includes(riskId);
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

  isChecked(controlName: string){
    return this.arForm.get(controlName).value == '1';
  }

  isFieldRequired(name){
    return !!this.arForm.controls[name].validator(name).hasOwnProperty('required');
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.arForm.controls[controlName];
		if (!control) {
			return false;
		}
    return control.hasError(validationType) && (control.dirty || control.touched);
  }


  /** Signature */
  initFilteredSalaries(){
    this.signatures.controls.forEach(control => {
      this.filteredSalaries = control.get('personnel').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
  }

  private _filter(value: string): Array<User> {
    const filterValue = value;
    return this.salaries.filter(salary => 
      this._normalizeValue(salary.fullname).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  displayFn(salary:User): string {
    return salary ? salary.fullname : '';
  }

  get signatures() : FormArray {
    return this.arForm.get('signatures') as FormArray;
  }

  newSignature(): FormGroup {
    return this.fb.group({
      date:[new Date()],
      personnel:[''],
      society:[''],
      signature:[''],
      commentaires:[''],
      remarks:[''],
    });
  }

  addSignatures() {
    this.signatures.push(this.newSignature());
    this.initFilteredSalaries();
  }

  removeSignature(i:number) {
    this.signatures.removeAt(i);
  }

  editSignature(){

  }

  deleteSignature(){
    this.signaturePad.clear();
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
   // this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
   // this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());

    (this.arForm.get('signature') as FormGroup)
      .controls['signature']
      .setValue(this.signaturePad.toDataURL());
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  // private addCheckboxes() {
  //   this.risksList.forEach((value) => {
  //     value.risques.forEach((o, i) => {
  //       console.log(o['id']);
  //       const control = new FormControl();
  //       // (this.arForm.controls.risques as FormArray).push(control);
  //       (this.arForm.controls.risques as FormArray).controls[o['id']] = control;
  //     });

  //     console.log(this.arForm.controls.risques);
  //   });
  // }

  partHided(key){
    return !this.parts.includes(key);
  }
  showPart(key){
    if(!this.parts.includes(key)){
      this.parts.push(key);
    }
  }
}
