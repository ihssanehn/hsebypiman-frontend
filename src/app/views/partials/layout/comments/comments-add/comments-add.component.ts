import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'tf-comments-add',
  templateUrl: './comments-add.component.html',
  styleUrls: ['./comments-add.component.scss']
})
export class CommentsAddComponent implements OnInit {

  form: FormGroup;
  formloading: boolean = false;
  loaded = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      comment: [null, Validators.required]
    })

		this.loaded = true;
  }

  onSubmit(){
    let form = {...this.form.getRawValue()};
    this.activeModal.close(form.comment);
  }

  onCancel(){
    this.activeModal.close();
  }

}
