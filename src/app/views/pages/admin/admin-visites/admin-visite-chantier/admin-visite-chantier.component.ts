import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { TypeService } from '@app/core/services';
import { Type } from '@app/core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';



@Component({
  selector: 'tf-admin-visite-chantier',
  templateUrl: './admin-visite-chantier.component.html',
  styleUrls: ['./admin-visite-chantier.component.scss']
})
export class AdminVisiteChantierComponent implements OnInit {

  types: Type[];
  
  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  async getTypes(){
      var res = await this.typeService.getAllFromModel('VsChantier').toPromise();
      this.types = res.result.data
      this.cdr.markForCheck();
  }
  getTpl(type){
    return {
        title : 'Questions '+type.libelle,
        deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs chantiers',
        deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs chantiers',
        collapsed : false,
        childCol : 6
      }
  }

  async createFormulaire(payload, appends){
    if(payload){
      var ordre = this.types.length + 1;
      var _payload = {
        model:'VsChantier',
        ordre: ordre,
        code: 'OTHER',
        ...payload
      }
      try {
        var created = await this.typeService.create({ ..._payload, ...appends }).toPromise();
        this.types.push(created);
        this.cdr.markForCheck();
      } catch (error) {
        console.error(error);
      }
    }
  }

  addFormulaire(appends?){
    var title="Nouveau formulaire"
    const modalRef = this.modalService.open(AdminAddModalComponent, {centered : true});
    modalRef.componentInstance.title = ( title || '...' );
    modalRef.result.then( payload => this.createFormulaire(payload, appends), payload => this.createFormulaire(payload, appends) );
  }
  
  
  async titleDeleted($event){
    try {
      await this.typeService.delete($event.id)
        .toPromise()
        .then((res:any) => {
          Swal.fire({ icon: 'success', 
            title:"Le formulaire a bien été archivé", 
            showConfirmButton: false, 
            timer: 1500 
          })
          var typeIdx = this.types.map(x=>x.id).indexOf($event.id);
          this.types.splice(typeIdx, 1);
        })
        .catch(err =>{ 
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: "Suppression impossible car le formulaire est affectée à une ou plusieures visites",
            showConfirmButton: false,
            timer: 3000
          });
  
        });
        
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
    
  }
}
