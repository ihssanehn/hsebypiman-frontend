import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { User, AuthService } from '@app/core/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { SignatureService, EntrepriseService, ArService } from '@app/core/services';
import { Signature, Entreprise } from '@app/core/models';
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
  private _observations = new BehaviorSubject<string>(null);
  @Input()
  set observations(value) {
      this._observations.next(value);
  };
  get observations() {
    return this._observations.getValue();
  }
  @Input() isSigned: boolean;

  @ViewChild(SignaturePad,null) signaturePad: SignaturePad;
  private canvas: Object = {
    'minWidth': 0.5,
    'canvasWidth': 500,
    'canvasHeight': 150
  }
  public signaturePadOptions: Object = { 
    'minWidth': this.canvas['minWidth'],
    'canvasWidth': this.canvas['canvasWidth'],
    'canvasHeight': this.canvas['canvasHeight'],
  };

  displayedColumns: string[] = ['date', 'fullname', 'entreprise', 'comments', 'signature'];
  signaturesForm: FormArray;
  currentUser : User;
  signable_id : number;
  salaries : Array<User>;
  entreprisesList: Entreprise[];
  entreprisesLoaded: boolean = false;
  filteredSalaries: Observable<Array<User>>;
  public signatures : Array<Signature>;
  public observation : string;
  errors;

  constructor(
    private authService: AuthService,
    private signatureService: SignatureService,
    private arService: ArService,
    private entrepriseService: EntrepriseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getEntreprises();
    this.createForm();
    this.getCurrentUser();

    this.activatedRoute.params
    .subscribe(
      async params => {
        if(params.id){
          this.signable_id = params.id;
          if(!this.isSigned){
            (this.signaturesForm as FormArray)
            .controls[0]
            .get('signable_id')
            .setValue(params.id);
          }
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

    this._observations
    .subscribe(
      x => {
        if(this.observations)
          this.observation = this.observations;
      }
    );
  }

  createForm() {
    this.signaturesForm = this.fb.array([]);

    if(!this.isSigned){
      this.signaturesForm.insert(0, 
        this.fb.group({
          signable_id:[null],
          date:[this.setDateFormat(new Date())],
          personnel:[null],
          personnel_id:[null],
          signataire_fullname:[null],
          entreprise_id:[null],
          signature:[null, Validators.required],
          commentaires:[null],
          remarks:[null],
        })
      );
    }

  }


  async getCurrentUser(){
    var res = await this.authService.getUserByToken().toPromise();
    this.currentUser = res.result.data;
    if(!this.isSigned){
      (this.signaturesForm as FormArray).controls[0].get('personnel_id').setValue(res.result.data.id);
      (this.signaturesForm as FormArray ).controls[0].get('personnel').setValue(res.result.data);
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getEntreprises(){
    this.entreprisesLoaded = false;
    var res = await this.entrepriseService.getList().toPromise();
    if(res){
      this.entreprisesList = res.result.data;
      this.entreprisesLoaded = true;
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  resizeSignaturePad() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePad.set('canvasWidth', this.canvas['canvasWidth'] / ratio);
  }

  clearSignature(i:number) {
    this.signaturePad.clear();
    this.signaturesForm.controls[i].get('signature').reset();
  }

  ngAfterViewInit() {
    if(!this.signatures){
      this.signaturePad.set('minWidth', 0.5);
      this.signaturePad.clear();
    }
  }
 
  drawComplete(i:number) {
    this.signaturesForm
      .controls[i].get('signature')
      .setValue(this.signaturePad.toDataURL());
  }
 
  drawStart() {
  }

  async onSubmit(event){

    try {
        let form = {...this.signaturesForm.value};

        this.arService.addSignatures(this.signable_id, form)
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
              this.signaturesForm = { ...err.error};
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

  newSignature(): FormGroup {
    return this.fb.group({
      signable_id:[this.signable_id],
      date:[this.setDateFormat(new Date())],
      personnel:[null],
      personnel_id:[null],
      signataire_fullname:[null],
      entreprise_id:[null, Validators.required],
      signature:[null],
      commentaires:[null],
      remarks:[null],
    });
  }

  addSignatures() {
    this.signaturesForm.insert(0, this.newSignature());
  }

  removeSignature(i:number) {
    this.signaturesForm.removeAt(i);
  }

  editSignature(){}

  deleteSignature(){
    this.signaturePad.clear();
  }

}
