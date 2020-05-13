import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, Injector } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '../admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-admin-template',
  template: ''
})
export class AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;
  
  tpl : any = {
    title : 'Titre',
    collapsed : false,
    childCol : 6
  }

  list: any[];

  constructor(injector : Injector) {}

  ngOnInit() {
    this.getList();
  }

  initChildren(item){
    item['children'] = [];
    return item;
  }

  formatChildren(item){}

  async getList(){
    try {
      var res = await this.parentService.getAll().toPromise();
      this.list = res.result.data.map( item => this.formatChildren(item) );
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(title?, appends?){
    const modalRef = this.modalService.open(AdminAddModalComponent, {centered : true});
    modalRef.componentInstance.title = ( title || '...' );
    modalRef.result.then( payload => this.createItem(payload, appends), payload => this.createItem(payload, appends) );
  }

  async createItem(payload, appends?){
    if(payload){
        try {
          var created = await this.parentService.create({ ...payload, ...appends }).toPromise();
          created = this.initChildren(created);
          this.list.unshift(created);
          this.cdr.markForCheck();
        } catch (error) {
          console.error(error);
        }
    }
  }

  async saveItem(item){
    try {
      var updated = await this.parentService.update(item).toPromise();
      const index = this.list.findIndex(type => type.id === updated.id);
      this.list[index] = { ...this.list[index], ...updated };
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async getItem({id}){
    try {
      var item = await this.parentService.get(id).toPromise();
      const index = this.list.findIndex(item => item.id === id);
      this.list[index] = this.formatChildren(item);
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async deleteItem({id}, confirm? : any){
    try {
      await this.parentService.delete(id).toPromise();
      const index = this.list.findIndex(item => item.id === id);
      this.list.splice(index, 1);
      Swal.fire({ icon: 'success', 
                  title: ( confirm ? confirm.title :  '...'), 
                  showConfirmButton: false, 
                  timer: 1500 
                })
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addChild(payload){
    try {
      await this.childService.create(payload).toPromise();
      this.getItem({ id : payload.parent_id});
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

  async deleteChild({id, parent_id}, confirm? : any){
    try {
      await this.childService.delete(id).toPromise();
      Swal.fire({ icon: 'success', 
                  title: ( confirm ? confirm.title :  '...'), 
                  showConfirmButton: false, 
                  timer: 1500 
                })
      this.getItem({ id : parent_id });
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  // BACK TODO
  generateCode(str){
    return str.replace(/\s/g, '').toUpperCase();
  }

  // BACK TODO
  generateOrdre(item_id){
    const index = this.list.findIndex(item => item.id === item_id);
    return this.list[index].children.length;
  }

  generateParentOrdre(){
    return this.list.length
  }
  
}
