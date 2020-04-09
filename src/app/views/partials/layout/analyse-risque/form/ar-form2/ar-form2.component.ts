import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { CatRisqueService } from '@app/core/services';
import { CatRisque } from '@app/core/models';


const ELEMENT_DATA: any[] = [
  {risks: 1, actions: 'Hydrogen', comments: 1.0079}
];


@Component({
  selector: 'kt-ar-form2',
  templateUrl: './ar-form2.component.html',
  styleUrls: ['./ar-form2.component.scss']
})
export class ArForm2Component implements OnInit {

  displayedColumns: string[] = ['risks', 'actions', 'comments'];
  public risksList : Array<CatRisque>;

  @Input() arForm: FormGroup;

  constructor(
    private catRisqueService: CatRisqueService,
    private cdr: ChangeDetectorRef,
  ) { 
    
  }

  ngOnInit() {
    this.getCatRisques();
  }

  async getCatRisques(){
    this.risksList = await this.catRisqueService.getAll().toPromise();
    //this.addCheckboxes();
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

  onCommentCheckChange(id, event) {
    
    // const formArray: FormArray = this.arForm.get('comments') as FormArray;
  
    // /* Selected */
    // if(event.source.value){
    //   // Add a new control in the arrayForm
    //   formArray.push(new FormControl(event.source.value));
    // }
    // /* unselected */
    // else{
    //   // find the unselected element
    //   let i: number = 0;
  
    //   formArray.controls.forEach((ctrl: FormControl) => {
    //     if(ctrl.value == event.source.value) {
    //       // Remove the unselected element from the arrayForm
    //       formArray.removeAt(i);
    //       return;
    //     }
  
    //     i++;
    //   });
    // }
  }

  // private addCheckboxes() {
  //   this.risksList.forEach((value) => {
  //     value.risques.forEach((o, i) => {
  //       console.log(o['id']);
  //       const control = new FormControl();
  //       // (this.arForm.controls.risques as FormArray).push(control);
  //       (this.arForm.controls.risques as FormArray).controls[o['id']] = control;
  //     });

  //     console.log(this.arForm.controls.risques);
  //   });
  // }

}
