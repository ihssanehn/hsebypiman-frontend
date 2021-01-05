import { Component, OnInit, ChangeDetectorRef, Injector, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategorieService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'materiel-types-admin',
  styleUrls: ['../../../../partials/layout/admin-template/admin-template.component.scss'],
  templateUrl: './materiel-types-admin.component.html'
})
export class MaterielTypesAdminComponent extends AdminTemplateComponent implements OnInit {

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
    this.parentService = injector.get(CategorieService);
    this.childService = injector.get(CategorieService);
    this.translate = injector.get(TranslateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.refreshTranslations();
    this.tpl = {
      title : this.translate.instant("MATERIELS.NOTIF.ELEMENT_NOT_DELETED.SHORTTITLE"),
      deletedMessage: this.translate.instant("MATERIELS.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
      deletedChildMessage: this.translate.instant("MATERIELS.NOTIF.ELEMENT_NOT_DELETED.LABEL"),
      collapsed : false,
      canUpdateTitle: false,
      titleOject: null,
      childCol : 12
    }
  }

  refreshTranslations(){
		this.translate.stream("MATERIELS.NOTIF.ELEMENT_NOT_DELETED.SHORTTITLE").subscribe(x =>{
			 this.tpl.title = x;
		});
		this.translate.stream("MATERIELS.NOTIF.ELEMENT_NOT_DELETED.TITLE").subscribe(x =>{
			this.tpl.deletedMessage = x;
	   });
		this.translate.stream("MATERIELS.NOTIF.ELEMENT_NOT_DELETED.LABEL").subscribe(x =>{
			this.tpl.deletedChildMessage = x;
		});
	}

  async getList(){
    try {
      var res = await this.parentService.getAllAsAdmin({model:'Materiel',structure:true}).toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async getItem({id}){
    try {
      var item = await this.parentService.get(id).toPromise();
      const index = this.list.findIndex(item => item.id === id);
      this.list[index]['children'] = item.children;
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async addItem(){
    super.addItem(this.translate.instant("MATERIELS.ACTION.ADD_MATERIAL_TYPE"), {model : 'Materiel'});  
  }

  async createItem(payload){
    payload = {...payload, ordre : this.generateParentOrdre(), model: 'Materiel' }
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle)}

    super.createItem(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : this.translate.instant("MATERIELS.NOTIF.MATERIEL_TYPE_ARCHIVED.TITLE") });
  }

  async addChild(item){
    let payload = { ...item, 
      model : 'Materiel',
      code : this.generateCode(item.libelle),
      ordre : this.generateOrdre(item.parent_id)
    };
    super.addChild(payload);
  }

  async updateChild(item){
    super.updateChild(item);
  }

  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : this.translate.instant("MATERIELS.NOTIF.ELEMENT_ARCHIVED.TITLE") });
  }
}
