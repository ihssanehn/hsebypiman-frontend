
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { AuthService, User } from '@app/core/auth';
import { CatQuestion } from '@app/core/models';
import { CatQuestionService } from '@app/core/services';
import { first } from 'rxjs/operators';


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
    this.catQuestionsList = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  partHided(partId){
    console.log(partId);
    return true;
  }
  showPart(partId){
    console.log(partId)
  }

}
