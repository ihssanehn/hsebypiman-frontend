import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatHabilitationService, HabilitationService, TypeService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'action-origines-admin',
  styleUrls: ['./action-origines-admin.component.scss'],
  templateUrl: './action-origines-admin.component.html'
})
export class ActionOriginesAdminComponent extends AdminTemplateComponent implements OnInit {

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
      title : this.translate.instant("PLANACTIONS.NOTIF.ELEMENT_NOT_DELETED.SHORTTILE"),
      deletedMessage: this.translate.instant("PLANACTIONS.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
      deletedChildMessage: this.translate.instant("PLANACTIONS.NOTIF.ELEMENT_NOT_DELETED.LABEL"),
      collapsed : false,
      canUpdateTitle: false,
      titleOject: null,
      childCol : 12
    }
  }

  refreshTranslations(){
		this.translate.stream("PLANACTIONS.NOTIF.ELEMENT_NOT_DELETED.SHORTTILE").subscribe(x =>{
			 this.tpl.title = x;
		});
		this.translate.stream("PLANACTIONS.NOTIF.ELEMENT_NOT_DELETED.TITLE").subscribe(x =>{
			this.tpl.deletedMessage = x;
	   });
		this.translate.stream("PLANACTIONS.NOTIF.ELEMENT_NOT_DELETED.LABEL").subscribe(x =>{
			this.tpl.deletedChildMessage = x;
		});
	}

  async getList(){
    try {
      var res = await this.parentService.getAllAsAdmin({'model': 'Action'}).toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem(this.translate.instant("PLANACTIONS.ACTION.ADD_ORIGIN"), {model: 'Action'});  
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : this.translate.instant("PLANACTIONS.NOTIF.ORIGIN_ARCHIVED.TITLE") });
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
