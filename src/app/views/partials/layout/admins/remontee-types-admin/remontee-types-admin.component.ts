import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'remontee-types-admin',
  styleUrls: ['./remontee-types-admin.component.scss'],
  templateUrl: './remontee-types-admin.component.html'
})
export class RemonteeTypesAdminComponent extends AdminTemplateComponent implements OnInit {

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
    this.parentService = injector.get(TypeService);
    this.translate = injector.get(TranslateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.refreshTranslations();
    this.tpl = {
      title : this.translate.instant("REMONTEES.NOTIF.ELEMENT_NOT_DELETED.SHORTTITLE"),
      deletedMessage: this.translate.instant("REMONTEES.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
      deletedChildMessage: this.translate.instant("REMONTEES.NOTIF.ELEMENT_NOT_DELETED.LABEL"),
      collapsed : false,
      canUpdateTitle: false,
      titleOject: null,
      childCol : 12
    }
  }

  refreshTranslations(){
		this.translate.stream("REMONTEES.NOTIF.ELEMENT_NOT_DELETED.SHORTTITLE").subscribe(x =>{
			 this.tpl.title = x;
		});
		this.translate.stream("REMONTEES.NOTIF.ELEMENT_NOT_DELETED.TITLE").subscribe(x =>{
			this.tpl.deletedMessage = x;
	   });
		this.translate.stream("REMONTEES.NOTIF.ELEMENT_NOT_DELETED.LABEL").subscribe(x =>{
			this.tpl.deletedChildMessage = x;
		});
	}

  async getList(){
    try {
      var res = await this.parentService.getAllFromModel('Remontee').toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem(this.translate.instant("REMONTEES.ADD_LIFT_TYPE.TITLE"), {ordre: this.generateParentOrdre()});  
  }

  async createItem(payload){
    payload = {...payload, ordre : this.generateParentOrdre(), model: 'Remontee' }
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle)}

    super.createItem(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : this.translate.instant("REMONTEES.NOTIF.LIFT_TYPE_ARCHIVED.TITLE") });
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
