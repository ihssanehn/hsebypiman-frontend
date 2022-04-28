import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-admin-add-modal',
  templateUrl: './admin-add-modal.component.html',
  styleUrls: ['./admin-add-modal.component.scss']
})
export class AdminAddModalComponent implements OnInit {

  @Input() withImage: boolean = false;
  
  title: string = '...';

  label: string = '';
  image: any;
  disableUpload: boolean;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  handleChange({ file, fileList }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      console.log("file uploaded successfully");
    } else if (status === 'error') {
      console.log("file upload failed");
    }
  }


  async submit() {
    this.activeModal.close({ 
      libelle: this.label, 
      label : this.label,
      image : this.image  
    });
  }



  beforeUpload = (file): boolean => {
    var reader = new FileReader();
    reader.onloadend = () => {
      this.image = reader.result;
      if(this.image) this.disableUpload = true;
    }
    reader.readAsDataURL(file);
    return false;
  }

  deleteFile() {
    this.disableUpload = false;
  }

}