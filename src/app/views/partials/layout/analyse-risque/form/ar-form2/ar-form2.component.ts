import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { CatRisqueService, EpiTypesService } from '@app/core/services';
import { CatRisque } from '@app/core/models';
import { EpiType } from '@app/core/models/epiType.model';
import { User, AuthService } from '@app/core/auth';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'tf-ar-form2',
  templateUrl: './ar-form2.component.html',
  styleUrls: ['./ar-form2.component.scss']
})
export class ArForm2Component implements OnInit {

  @Input() arForm: FormGroup;
  @ViewChild(SignaturePad,null) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { 
    'minWidth': 5,
    'canvasWidth': 250,
    'canvasHeight': 100
  };
  
  displayedColumns: string[] = ['risks', 'actions', 'comments'];
  public risksList : Array<CatRisque>;
  public epiList : Array<EpiType>;
  public user : User;
  //public curDate : Date;
  
  public salaries : Array<User>;
  filteredSalaries: Observable<Array<User>>;

  constructor(
    private catRisqueService: CatRisqueService,
    private epiTypesService: EpiTypesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { 
    this.getCatRisques();
    this.getEpiTypes();
    //this.curDate = new Date();
  }

  ngOnInit() {
    //this.getAllUsers();
  }

  async getCatRisques(){
    this.risksList = await this.catRisqueService.getAll().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getEpiTypes(){
    this.epiList = await this.epiTypesService.getAll().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getAllUsers(){
    this.salaries = await this.authService.getAllUsers().toPromise();
    this.initFilteredSalaries();
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

  onEpiCheckChange(event) {
    const formArray: FormArray = this.arForm.get('epis') as FormArray;
  
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

  onEpiIsChecked(epiId){
    return this.arForm.get('epis').value.includes(epiId);
  }

  onCommentCheckChange(id, event) {
    
    // const formArray: FormArray = this.arForm.get('comments') as FormArray;
  
    // /* Selected */
    // if(event.source.value){
    //   // Add a new control in the arrayForm
    //   formArray.push(new FormControl(event.source.value));
    // }
    // /* unselected */
    // else{
    //   // find the unselected element
    //   let i: number = 0;
  
    //   formArray.controls.forEach((ctrl: FormControl) => {
    //     if(ctrl.value == event.source.value) {
    //       // Remove the unselected element from the arrayForm
    //       formArray.removeAt(i);
    //       return;
    //     }
  
    //     i++;
    //   });
    // }
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

}
