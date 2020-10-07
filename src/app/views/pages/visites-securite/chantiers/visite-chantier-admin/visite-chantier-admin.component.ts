import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { CatHabilitationService, HabilitationService, TypeService } from '@app/core/services';
import { Type } from '@app/core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'tf-visite-chantier-admin',
  templateUrl: './visite-chantier-admin.component.html',
  styleUrls: ['./visite-chantier-admin.component.scss']
})
export class VisiteChantierAdminComponent implements OnInit {

  types: Type[];
  
  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translate: TranslateService
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
        title : this.translate.instant("VISITES.NOTIF.ELEMENT_NOT_DELETED.CHANTIER.SHORTTILE")+' '+type.libelle,
        deletedMessage: this.translate.instant("VISITES.NOTIF.ELEMENT_NOT_DELETED.CHANTIER.TITLE"),
        deletedChildMessage: this.translate.instant("VISITES.NOTIF.ELEMENT_NOT_DELETED.CHANTIER.LABEL"),
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
    var title = this.translate.instant("VISITES.ACTION.ADD_FORM.LABEL");
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
            title: this.translate.instant("VISITES.NOTIF.FORM_ARCHIVED.TITLE"),
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
            title: this.translate.instant("VISITES.NOTIF.ELEMENT_NOT_DELETED.CHANTIER.SUBLABEL"),
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
