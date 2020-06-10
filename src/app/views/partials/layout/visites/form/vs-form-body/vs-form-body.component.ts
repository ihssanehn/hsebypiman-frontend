
import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService, User } from '@app/core/auth';
import { CatQuestion } from '@app/core/models';
import { CatQuestionService } from '@app/core/services';
import { first } from 'rxjs/operators';
import { FakeApiService } from '@app/core/_base/layout/server/fake-api/fake-api.service';
import moment from 'moment';


@Component({
  selector: 'tf-vs-form-body',
  templateUrl: './vs-form-body.component.html',
  styleUrls: ['./vs-form-body.component.scss']
})
export class VsFormBodyComponent implements OnInit {

  today;

  @Input() visiteForm: FormGroup;
  @Input() isDisableToggle: boolean;
  @Input() catQuestionsList: CatQuestion[];
  @Input() origin: string;
  @Input() edit: Boolean;
  @Output() dateUpdated = new EventEmitter();

  public isExpanded: boolean = true;

  constructor(
    private catQuestionService: CatQuestionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.today = moment().format('DD/MM/YYYY');
    //console.log(this.visiteForm);
  }

  partHided(partId) {
    // console.log(partId);
    return true;
  }
  showPart(partId) {
    //console.log(partId)
  }

  setNote(question_id, cat_index, note) {
    const p = this.getPivot(question_id, cat_index)
    p.get('note').setValue(note);
    console.log(this.visiteForm);
  }

  hasNote(question_id, cat_index, note) {
    const p = this.getPivot(question_id, cat_index)
    return p.get('note').value == note;
  }

  getQuestion(question_id, cat_index): FormGroup {
    const questions = (this.visiteForm.get('catQuestionsList') as FormArray).at(cat_index) as FormArray;
    if (!questions) return null; 
    const qIdx = questions.get('questions').value.map(question => { return question.id }).indexOf(question_id);
    const q = (questions.get('questions') as FormArray).at(qIdx) as FormGroup;
    return q;
  }

  getPivot(question_id, cat_index): FormGroup {
    const q = this.getQuestion(question_id, cat_index)
    console.log((this.visiteForm.get('catQuestionsList') as FormArray).at(cat_index));
    if (!q) return null;
    const p = q.get('pivot') as FormGroup;
    if (!p) return null;
    return p;
  }
  getPivotObs(question_id, cat_index) {
    const p = this.getPivot(question_id, cat_index);
    return p ? p.get('observation').value : null;
  }
  getPivotDate(question_id, cat_index) {
    const p = this.getPivot(question_id, cat_index);
    return p ? p.get('date_remise_conf').value : null;
  }

  getNotes() {
    const test = this.visiteForm.get('questions').value;
    var ok = test.filter(x => x.pivot.note == 1).length
    var ko = test.filter(x => x.pivot.note == 2).length
    var ko_unsolved = test.filter(x => x.pivot.note == 2 && !x.pivot.date_remise_conf).length
    var ko_solved = test.filter(x => x.pivot.note == 2 && x.pivot.date_remise_conf).length
    var so = test.filter(x => x.pivot.note == 3).length
    var total = test.length;
    return { 'ok': ok, 'ko': ko, 'so': so, 'ko_unsolved': ko_unsolved, 'ko_solved': ko_solved, 'total': total };
  }

  enableDate(i, cat_index) {
    this.getPivot(i, cat_index).get('date_remise_conf').enable();
  }
  canEditDate(i, cat_index) {
    return this.origin != 'add' && this.getPivot(i, cat_index).get('note').value == 2 && this.getPivot(i, cat_index).get('date_remise_conf').value == null
  }
  updateDate(i, cat_index) {
    this.getPivot(i, cat_index).get('date_remise_conf').disable();
    if (this.getPivot(i, cat_index).get('date_remise_conf').value) {
      this.dateUpdated.emit(true);
    }
  }
  cancelDate(i, cat_index) {
    this.getPivot(i, cat_index).get('date_remise_conf').setValue(null);
    this.getPivot(i, cat_index).get('date_remise_conf').disable();
  }


}
