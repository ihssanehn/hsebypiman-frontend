
import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from '@app/core/auth';
import { CatQuestion, Etat } from '@app/core/models';
import { CatQuestionService, EtatService } from '@app/core/services';
import moment from 'moment';


@Component({
  selector: 'tf-vs-form-body',
  templateUrl: './vs-form-body.component.html',
  styleUrls: ['./vs-form-body.component.scss']
})
export class VsFormBodyComponent implements OnInit {

  today;
  etats : Etat[];

  @Input() visiteForm: FormGroup;
  @Input() isDisableToggle: boolean;
  @Input() catQuestionsList: CatQuestion[];
  @Input() origin: string;
  @Input() model: string;
  @Input() edit: Boolean;
  @Output() dateUpdated = new EventEmitter();

  public isExpanded: boolean = true;

  constructor(
    private catQuestionService: CatQuestionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private etatService: EtatService
  ) { }

  ngOnInit() {
    this.today = moment().format('DD/MM/YYYY');
    this.getEtatsList();
  }

  async getEtatsList(){
    await this.etatService.getAll().toPromise().then(res=>{
      this.etats = res.result.data;
    })
  }

  getEtat(){
    if(this.etats && this.visiteForm.get('etat_id').value){
      return this.etats.filter(x=>x.id == this.visiteForm.get('etat_id').value).length > 0 ? 
        this.etats.filter(x=>x.id == this.visiteForm.get('etat_id').value)[0].libelle : null;
    }
  }

  partHided(partId) {
    return true;
  }
  showPart(partId) {
  }

  setNote(question_id, cat_index, note) {
    const p = this.getPivot(question_id, cat_index)
    p.get('note').setValue(note);
  }

  hasNote(question_id, cat_index, note) {
    const p = this.getPivot(question_id, cat_index)
    return p.get('note').value == note;
  }
  isChecked(question_id, cat_index) {
    const p = this.getPivot(question_id, cat_index)
    return p.get('action_to_visited').value == 1;
  }

  toggleActionToVisited($event, question_id, cat_index){
    const p = this.getPivot(question_id, cat_index)
    if($event){
      p.get('action_to_visited').setValue(1);
    }else{
      p.get('action_to_visited').setValue(0);
    }
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
  getPivotActionToVisited(question_id, cat_index) {
    const p = this.getPivot(question_id, cat_index);
    return p ? p.get('action_to_visited').value : null;
  }

  getNotes() {
    const test = this.visiteForm.get('catQuestionsList').value
    var questions = test.reduce((prev, curr)=> prev.concat(curr.questions), []);
    var ok = questions.filter(x => x.pivot.note == 1).length
    var ko = questions.filter(x => x.pivot.note == 2).length
    var ko_unsolved = questions.filter(x => x.pivot.note == 2 && !x.pivot.date_remise_conf).length
    var ko_solved = questions.filter(x => x.pivot.note == 2 && x.pivot.date_remise_conf).length
    var so = questions.filter(x => x.pivot.note == 3).length
    var total = questions.length;
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

  getPresenceNc(){
    return this.getNotes().ko > 0;
  }

  getHasRectifImmediate(){
    return this.getNotes().ko > 0 && this.getNotes().ko_unsolved == 0
  }



}
