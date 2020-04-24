import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { CatRisqueService, EpiTypesService } from '@app/core/services';
import { CatRisque } from '@app/core/models';
import { EpiType } from '@app/core/models/epiType.model';


@Component({
  selector: 'tf-ar-form2',
  templateUrl: './ar-form2.component.html',
  styleUrls: ['./ar-form2.component.scss']
})
export class ArForm2Component implements OnInit {

  @Input() arForm: FormGroup;
  @Input() edit: Boolean;
  
  displayedColumns: string[] = ['risks', 'actions', 'comments'];
  public risksList : Array<CatRisque>;
  public epiList : Array<EpiType>;

  constructor(
    private catRisqueService: CatRisqueService,
    private epiTypesService: EpiTypesService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { 
    this.getCatRisques();
    this.getEpiTypes();
  }

  ngOnInit() {
  }

  async getCatRisques(){
    var res = await this.catRisqueService.getAll().toPromise();
    this.risksList = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getEpiTypes(){
    var res = await this.epiTypesService.getAll().toPromise();
    this.epiList = res.result.data;
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

    const formArray: FormArray = this.arForm.get('comments') as FormArray;

    if(event.target.value){
      const commentGroup: FormGroup = this.fb.group({
        'cat_risque_id': id,
        'commentaire': event.target.value
      });

      formArray.push(commentGroup);
    }
  }

  getCommentValue(id){
    var commentValue = '';
    const formValue = this.arForm.get('comments').value;
    formValue.forEach(element => {
      if(element.cat_risque_id == id){
        commentValue = element.commentaire;
      }
    });

    return commentValue;
  }

}
