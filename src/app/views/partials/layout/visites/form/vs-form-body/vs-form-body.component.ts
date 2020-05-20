
import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService, User } from '@app/core/auth';
import { CatQuestion } from '@app/core/models';
import { CatQuestionService } from '@app/core/services';
import { first } from 'rxjs/operators';
import { FakeApiService } from '@app/core/_base/layout/server/fake-api/fake-api.service';


@Component({
  selector: 'tf-vs-form-body',
  templateUrl: './vs-form-body.component.html',
  styleUrls: ['./vs-form-body.component.scss']
})
export class VsFormBodyComponent implements OnInit {

  catQuestionsList: CatQuestion[];

  @Input() visiteForm: FormGroup;
  @Input() edit: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  constructor(
    private catQuestionService:CatQuestionService,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getCatQuestions();
  }

  async getCatQuestions(){
    var params = {
      type_id: this.visiteForm.get('type_id').value,
      paginate:false
    }
    var res = await this.catQuestionService.getAll(params).toPromise();
    if(res){
      this.catQuestionsList = res.result.data;
      this.parseQuestions(res.result.data);
      this.cdr.detectChanges();
      this.cdr.markForCheck();
    }
  }

  parseQuestions(item){
    if(item.length > 0){
      const questionFormArray = this.visiteForm.get('questions') as FormArray

      for (let i = 0; i < item.length; i++) {
        const catQ = item[i]; 
        for (let j = 0; j < catQ.questions.length; j++) {
          const q = catQ.questions[j];
          const question = this.fb.group({
            'id': [q.id],
            'libelle': [q.libelle],
            'pivot': this.fb.group({
              'note':[{value:null, disabled:false}, Validators.required],
              'date_remise_conf':[{value:null, disabled:false}],
              'observation':[{value:'', disabled:false}]
            })
          })

          const pivot = question.get('pivot') as FormGroup;
          const note = pivot.get('note') as FormControl;
          const date_remise_conf = pivot.get('date_remise_conf') as FormControl;

          note.valueChanges.subscribe(note=>{
            if(note == 2){
              date_remise_conf.enable({emitEvent:false, onlySelf:true})
              this.visiteForm.get('presence_non_conformite').setValue(true);
            }else{
              date_remise_conf.disable({emitEvent:false, onlySelf:true})
              date_remise_conf.setValue(null);
              var nbr_ko = this.getNotes().ko;
              if(nbr_ko == 0 && this.visiteForm.get('presence_non_conformite').value == true){
                this.visiteForm.get('presence_non_conformite').setValue(false);
              }
            }
          })

          questionFormArray.push(question)
        }
      }
    }
  }

  partHided(partId){
    // console.log(partId);
    return true;
  }
  showPart(partId){
    console.log(partId)
  }

  setNote(question_id, note){
    const p = this.getPivot(question_id)
    p.get('note').setValue(note);
    console.log(this.visiteForm);
  }

  hasNote(question_id, note){
    const p = this.getPivot(question_id)    
    return p.get('note').value == note;
  }

  getQuestion(question_id): FormGroup{
    const questions = this.visiteForm.get('questions') as FormArray;
      if(!questions) return null;
    const qIdx = questions.controls.map(x=>{return x.get('id').value}).indexOf(question_id);
    const q = questions.at(qIdx) as FormGroup; 
    return q;
  }

  getPivot(question_id): FormGroup{
    const q = this.getQuestion(question_id)
      if(!q) return null;
    const p = q.get('pivot') as FormGroup;
      if(!p) return null;
    return p;
  }

  getNotes(){
    const test = this.visiteForm.get('questions').value;
    var ok = test.filter(x=>x.pivot.note == 1).length
    var ko = test.filter(x=>x.pivot.note == 2).length
    var ko_unsolved = test.filter(x=>x.pivot.note == 2 && !x.pivot.date_remise_conf).length
    var ko_solved = test.filter(x=>x.pivot.note == 2 && x.pivot.date_remise_conf).length
    var so = test.filter(x=>x.pivot.note == 3).length
    var total = test.length;
    
    return {'ok':ok, 'ko':ko, 'so':so, 'ko_unsolved':ko_unsolved, 'ko_solved':ko_solved, 'total':total};
  }

}
