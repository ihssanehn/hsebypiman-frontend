import { Component, OnInit, Input, Injector, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategorieService } from '@app/core/services';
import { AdminListPortletComponent } from '@app/views/partials/layout/admin-list-portlet/admin-list-portlet.component';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'materiel-types-admin-portlet',
  templateUrl: './materiel-types-admin-portlet.component.html',
  styleUrls: ['../../../../partials/layout/admin-list-portlet/admin-list-portlet.component.scss']
})
export class MaterielTypesAdminPortletComponent extends AdminListPortletComponent implements OnInit {

  @Input() item: any;

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;
  translate: TranslateService;


  tpl : any = {
    title : 'Titre',
    deletedMessage: 'Suppression impossible car la selection contient un élément affecté à un élément',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à un élément',
    collapsed : false,
    canUpdateTitle: false,
    titleOject: null,
    childCol : 6,
  }
  
  constructor(injector: Injector) {
    super();
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CategorieService);
    this.childService = injector.get(CategorieService);
    this.translate = injector.get(TranslateService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  async getItem({id}){
    try {
      var item = await this.parentService.get(id).toPromise();
      const index = this.item.children.findIndex(item => item.id === id);
      this.item.children[index]['children'] = item.children;
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async addItem(){
    var appends = {model : 'Materiel', parent_id: this.item.id};
    const modalRef = this.modalService.open(AdminAddModalComponent, {centered : true});
    modalRef.componentInstance.title = ( this.translate.instant("MATERIELS.ACTION.ADD_MATERIAL_TYPE") || '...' );
    modalRef.result.then( payload => this.createItem(payload, appends), payload => this.createItem(payload, appends) );
  }

  async createItem(payload, appends?){
    if(payload){
        payload = {...payload, ordre : this.generateParentOrdre(), model: 'Materiel' }
        if( payload.libelle )
          payload = { ...payload, code : this.generateCode(payload.libelle)}
        try {
          var created = await this.parentService.create({ ...payload, ...appends }).toPromise();
          created = this.initChildren(created);
          this.item.children.unshift(created);
          this.cdr.markForCheck();
        } catch (error) {
          console.error(error);
        }
    }
  }

  async addChildRow(payload){
    try {
      payload = {...payload, ordre : this.generateOrdre(), model: 'Materiel' }
      if( payload.libelle )
        payload = { ...payload, code : this.generateCode(payload.libelle)}
      await this.childService.create(payload).toPromise();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async updateChild(item){
    try {
      await this.childService.update(item).toPromise();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async deleteChildRow({id, parent_id}, confirm? : any){
    try {
      await this.childService.delete(id)
        .toPromise()
        .then((res:any) => {
          Swal.fire({ icon: 'success', 
            title: ( confirm ? confirm.title :  '...'), 
            showConfirmButton: false, 
            timer: 1500 
          })
          this.getItem({ id : parent_id });
        })
        .catch(err =>{ 

          Swal.fire({
            icon: 'error',
            title: this.tpl.deletedChildMessage,
            showConfirmButton: false,
            timer: 3000
          });
  
        });

      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async deleteItem({id}, confirm? : any){
    try {
      await this.parentService.delete(id)
        .toPromise()
        .then((res:any) => {
          Swal.fire({ icon: 'success', 
            title: ( confirm ? confirm.title :  '...'), 
            showConfirmButton: false, 
            timer: 1500 
          })
          if(this.item.id == id){
            this.item = null;
          }else{
            const index = this.item.children.findIndex(item => item.id === id);
            this.item.children.splice(index, 1);
          }
        })
        .catch(err =>{ 

          Swal.fire({
            icon: 'error',
            title: this.tpl.deletedMessage,
            showConfirmButton: false,
            timer: 3000
          });
  
        });
        
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  generateCode(str){
    return str.replace(/\s/g, '').toUpperCase();
  }

  generateOrdre(){
    return this.item.children.length;
  }

  generateParentOrdre(){
    return this.item.children.length
  }

  initChildren(item){
    item['children'] = [];
    return item;
  }
}
