import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { User, AuthService } from '@app/core/auth';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'tf-ar-signatures',
  templateUrl: './ar-signatures.component.html',
  styleUrls: ['./ar-signatures.component.scss']
})
export class ArSignaturesComponent implements OnInit {

  @Input() edit: Boolean;
  signatureForm: FormGroup;

  @ViewChild(SignaturePad,null) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { 
    'minWidth': 5,
    'canvasWidth': 250,
    'canvasHeight': 100
  };

  public user : User;
  public curDate : Date;
  public salaries : Array<User>;
  filteredSalaries: Observable<Array<User>>;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.curDate = new Date();
    this.createForm();
  }

  createForm() {
    this.signatureForm = this.fb.group({
      date:[new Date()],
      personnel:[''],
      society:[''],
      signature:[''],
      commentaires:[''],
      remarks:[''],
    });
  }

  async getCurrentUser(){
    var res = await this.authService.getUserByToken().toPromise();
    this.user = res.result.data;
    console.log(this.user);
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  // initFilteredSalaries(){
  //   this.signatureForm.controls.forEach(control => {
  //     this.filteredSalaries = control.get('personnel').valueChanges.pipe(
  //       startWith(''),
  //       map(value => this._filter(value))
  //     );
  //   });
  // }

  // private _filter(value: string): Array<User> {
  //   const filterValue = value;
  //   return this.salaries.filter(salary => 
  //     this._normalizeValue(salary.fullname).includes(filterValue)
  //   );
  // }

  // private _normalizeValue(value: string): string {
  //   return value.toLowerCase().replace(/\s/g, '');
  // }

  // displayFn(salary:User): string {
  //   return salary ? salary.fullname : '';
  // }

  // get signatures() : FormArray {
  //   return this.signatureForm.get('signatures') as FormArray;
  // }

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
    // this.signatures.push(this.newSignature());
    // this.initFilteredSalaries();
  }

  removeSignature(i:number) {
    // this.signatures.removeAt(i);
  }

  editSignature(){

  }

  deleteSignature(){
    this.signaturePad.clear();
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());

    (this.signatureForm as FormGroup)
      .controls['signature']
      .setValue(this.signaturePad.toDataURL());
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

}
