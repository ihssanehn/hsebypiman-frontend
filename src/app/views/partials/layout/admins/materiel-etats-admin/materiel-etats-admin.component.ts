import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EtatService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'materiel-etats-admin',
  styleUrls: ['./materiel-etats-admin.component.scss'],
  templateUrl: './materiel-etats-admin.component.html'
})
export class MaterielEtatsAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;
  translate: TranslateService;

  tpl : any;

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(EtatService);
    this.translate = injector.get(TranslateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.refreshTranslations();
    this.tpl = {
      title : this.translate.instant("ETATS.ADMIN_TITLE"),
      deletedMessage: this.translate.instant("ETATS.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
      deletedChildMessage: this.translate.instant("ETATS.NOTIF.ELEMENT_NOT_DELETED.LABEL"),
      collapsed : false,
      canUpdateTitle: false,
      titleOject: null,
      childCol : 12
    }
  }

  refreshTranslations(){
		this.translate.stream("ETATS.ADMIN_TITLE").subscribe(x =>{
			 this.tpl.title = x;
		});
		this.translate.stream("ETATS.NOTIF.ELEMENT_NOT_DELETED.TITLE").subscribe(x =>{
			this.tpl.deletedMessage = x;
	   });
		this.translate.stream("ETATS.NOTIF.ELEMENT_NOT_DELETED.LABEL").subscribe(x =>{
			this.tpl.deletedChildMessage = x;
		});
	}

  async getList(){
    try {
      var res = await this.parentService.getAll().toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem(this.translate.instant("ETATS.ADD_LIFT_TYPE.TITLE"), {ordre: this.generateParentOrdre()});  
  }

  async createItem(payload){
    payload = {...payload, ordre : this.generateParentOrdre(), model: 'Remontee' }
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle)}

    super.createItem(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : this.translate.instant("ETATS.NOTIF.LIFT_TYPE_ARCHIVED.TITLE") });
  }

  async updateOrders(datas){
    try {
      await this.parentService.updateOrders(datas).toPromise();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

}
