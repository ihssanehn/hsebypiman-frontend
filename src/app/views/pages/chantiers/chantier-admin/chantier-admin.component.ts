import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';


@Component({
  selector: 'tf-chantier-admin',
  templateUrl: './chantier-admin.component.html',
  styleUrls: ['./chantier-admin.component.scss']
})
export class ChantierAdminComponent implements OnInit {

  list: any[];

  constructor(private catHabilitationService:CatHabilitationService,
              private habilitationService:HabilitationService,
              private cdr: ChangeDetectorRef,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.getCatHabs();
  }

  formatItem(item){
    item['children'] = item['habilitations']
    return item;
  }

  async getCatHabs(){
    try {
      var res = await this.catHabilitationService.getAll().toPromise();
      this.list = res.result.data;
      this.list.map( item => this.formatItem(item) );
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async getCatHab({id}){
    try {
      var item = await this.catHabilitationService.get(id).toPromise();
      const index = this.list.findIndex(item => item.id === id);
      this.list[index] = this.formatItem(item);
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addCatHab(){
    const modalRef = this.modalService.open(AdminAddModalComponent, {centered : true});
    modalRef.componentInstance.title = "Ajouter une catégorie d'habilitation";
    modalRef.result.then( payload => this.createCatHab(payload), payload => this.createCatHab(payload) );
  }

  async createCatHab(payload){
    if(payload){
        try {
          var created = await this.catHabilitationService.create(payload).toPromise();
          this.list.unshift(created);
          this.cdr.markForCheck();
        } catch (error) {
          console.error(error);
        }
    }
  }

  async updateCatHab(item){
    try {
      var updated = await this.catHabilitationService.update(item.id, item).toPromise();
      const index = this.list.findIndex(item => item.id === updated.id);
      this.list[index] = { ...this.list[index], ...updated };
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async deleteCatHab({id}){
    try {
      await this.catHabilitationService.delete(id).toPromise();
      const index = this.list.findIndex(item => item.id === id);
      this.list.splice(index, 1);
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }


  async addHabilitation(item){
    try {
      await this.habilitationService.create({ ...item, cat_hab_id : item.parent_id}).toPromise();
      this.getCatHab({ id : item.parent_id});
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async updateHabilitation(item){
    try {
      await this.habilitationService.update(item.id, item).toPromise();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async deleteHabilitation({id, cat_hab_id}){
    try {
      await this.habilitationService.delete(id).toPromise();
      this.getCatHab({ id : cat_hab_id });
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }




}
