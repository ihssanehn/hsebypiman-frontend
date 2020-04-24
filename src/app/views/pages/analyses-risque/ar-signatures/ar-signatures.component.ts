import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { User, AuthService } from '@app/core/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { SignatureService } from '@app/core/services';
import { Signature } from '@app/core/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'tf-ar-signatures',
  templateUrl: './ar-signatures.component.html',
  styleUrls: ['./ar-signatures.component.scss']
})
export class ArSignaturesComponent implements OnInit {

  @Input() edit: Boolean;

  private _data = new BehaviorSubject<Signature[]>([]);
  @Input()
  set data(value) {
      this._data.next(value);
  };
  get data() {
    return this._data.getValue();
  }

  @ViewChild(SignaturePad,null) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { 
    'minWidth': 0.5,
    'canvasWidth': 250,
    'canvasHeight': 100
  };

  signatureForm: FormGroup;
  public curDate : Date;
  public salaries : Array<User>;
  filteredSalaries: Observable<Array<User>>;
  public signatures : Array<Signature>;
  errors;

  constructor(
    private authService: AuthService,
    private signatureService: SignatureService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.curDate = new Date();
    this.createForm();
    this.getCurrentUser();

    this.activatedRoute.params
    .subscribe(
      async params => {
        if(params.id){
          this.signatureForm.controls.ar_id.setValue(params.id);
        }
      }
    );

    this._data
    .subscribe(
      x => {
        if(this.data)
          this.signatures = this.data;
      }
    );

  }

  createForm() {
    this.signatureForm = this.fb.group({
      ar_id:[null],
      date:[new Date()],
      personnel:[null],
      personnel_id:[null],
      society:[null],
      signature:[null, Validators.required],
      commentaires:[null],
      remarks:[null],
    });
  }


  async getCurrentUser(){
    var res = await this.authService.getUserByToken().toPromise();
    this.signatureForm.controls.personnel_id.setValue(res.result.data.id);
    this.signatureForm.controls.personnel.setValue(res.result.data);
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

  clearSignature(i:number) {
    // this.signatures.removeAt(i);
    this.signaturePad.clear();
    this.signatureForm
    .controls['signature'].reset();
    console.log( this.signatureForm
      .controls['signature'].value);
  }

  editSignature(){

  }

  deleteSignature(){
    this.signaturePad.clear();
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    if(!this.signatures){
      this.signaturePad.set('minWidth', 0.5); // set szimek/signature_pad options at runtime
      this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    }
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());

    this.signatureForm
      .controls['signature']
      .setValue(this.signaturePad.toDataURL());
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  async onSubmit(event){

    try {

        let form = {...this.signatureForm.value};
        form.date = this.setDateFormat(form.date);

        this.signatureService.create(form)
          .toPromise()
          .then((signature) => {
            console.log(signature);
            this.errors = false; 
            this.cdr.markForCheck();
            
            Swal.fire({
              icon: 'success',
              title: 'Votre signature a bien été prise en compte',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/analyses-risque/list']);
            });
          })
          .catch(err =>{ 

            Swal.fire({
              icon: 'error',
              title: 'Echec! le formulaire est incomplet',
              showConfirmButton: false,
              timer: 2000
            });

            if(err.status === 422)
              this.signatureForm = { ...err.error};
              this.errors = true;

          });
          
        this.cdr.markForCheck();

    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  setDateFormat(date){
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }

}
