import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/core/auth';
import { PersonnelService, RemonteeService } from '@app/core/services';
import { DateFrToEnPipe, SelectOptionModel } from '@app/core/_base/layout';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-action-form-modal',
  templateUrl: './action-form-modal.component.html',
  styleUrls: ['./action-form-modal.component.scss']
})
export class ActionFormModalComponent implements OnInit {

  idRemontee: number;
  form: FormGroup;
  formloading: boolean = false;
  usersList: SelectOptionModel[];
  usersLoaded: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private userService:PersonnelService,
    private remonteeService: RemonteeService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private dateFrToEnPipe: DateFrToEnPipe
  ) { }

  ngOnInit() {
    this.getUsers();
    this.createForm();
  }

  onSubmit() {
    this.formloading = true;
    var dataForm = this.form.getRawValue();
    dataForm.delai = this.dateFrToEnPipe.transform(dataForm.delai);

    this.createActionFromRemontee(this.idRemontee, dataForm);
  }

  async createActionFromRemontee(remonteId: number, dataForm: any) {
    const res = await this.remonteeService.createAction(remonteId, dataForm).toPromise();
		if (res) {
      this.formloading = false;
      this.activeModal.close(true);
    }
  }

  onCancel() {
    this.activeModal.close();
  }

  createForm() {
		this.form = this.fb.group({
      libelle: ['', Validators.required],
      risque: [''],
      objectif: ['', Validators.required],
      actor_id: [null],
      pilote_id: [null],
      delai: [''],
      errors: this.fb.array([]),
    });
  }

  async getUsers(){
    this.usersLoaded = false;
    var res = await this.userService.getList().toPromise();
    if(res){
      this.usersList = res.result.data.map(user=>new SelectOptionModel(user.id, user.fullname));
      this.usersLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.form && this.form.controls[controlName]){
      const control = this.form.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.form.controls[controlName];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }
}
