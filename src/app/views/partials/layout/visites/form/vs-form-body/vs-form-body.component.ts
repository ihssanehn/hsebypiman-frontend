
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
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
      this.cdr.detectChanges();
      this.cdr.markForCheck();
    }
  }

  partHided(partId){
    console.log(partId);
    return true;
  }
  showPart(partId){
    console.log(partId)
  }

  setNote(question_id, note){
    const p = this.getPivot(question_id)
    p.get('note').setValue(note);
  }

  hasNote(question_id, note){
    const p = this.getPivot(question_id)    
    return p.get('note').value == note;
  }

  getQuestion(question_id): FormGroup{
    const questions = this.visiteForm.get('questions') as FormArray;
      if(!questions) return null;
    const q = questions.controls.filter(x=>x.get('id').value == question_id)[0] as FormGroup;
      if(!q) return null;

      return q;
  }

  getPivot(question_id): FormGroup{
    const q = this.getQuestion(question_id)
    const p = q.get('pivot') as FormGroup;
      if(!p) return null;

      return p;
  }
}
