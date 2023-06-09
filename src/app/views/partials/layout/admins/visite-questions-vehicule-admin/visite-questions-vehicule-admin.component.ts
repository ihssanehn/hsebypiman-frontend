import { Component, OnInit, ChangeDetectorRef, Input, Injector } from '@angular/core';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatQuestionService, QuestionService, TypeService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'visite-questions-vehicule-admin',
  templateUrl: '../../admin-template/admin-template.component.html',
  styleUrls: ['../../admin-template/admin-template.component.scss']
})
export class VisiteQuestionsVehiculeAdminComponent extends AdminTemplateComponent implements OnInit {

  @Input() set type(value: any) {
    this._type = value;
    if(value && value.libelle)
      this.tpl.title = value.libelle;
      this.tpl.titleObject = value;
  }


  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;
  translate: TranslateService;

  _type: any;
  list: any[];
  tpl: any;

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CatQuestionService);
    this.childService = injector.get(QuestionService);
    this.titleService = injector.get(TypeService);
    this.translate = injector.get(TranslateService);

  }

  ngOnInit() {
    super.ngOnInit();
    // this.tpl = {
    //   title : this.translate.instant("VISITES.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
    //   deletedMessage: this.translate.instant("VISITES.NOTIF.ELEMENT_NOT_DELETED.VEHICULE.TITLE"),
    //   deletedChildMessage: this.translate.instant("VISITES.NOTIF.ELEMENT_NOT_DELETED.VEHICULE.LABEL"),
    //   collapsed : true,
    //   canUpdateTitle: true,
    //   titleObject: null,
    //   childCol : 6
    // }
  }

  formatChildren(item){
    item['children'] = item['questions']
    return item;
  }

  async addItem(){
    super.addItem(this.translate.instant("VISITES.ACTION.ADD_QUESTION_CATEGORY.TITLE"), {type_id : this._type.id});  
  }

  async getList(item){
    let payload = { ...item, type_id : this._type.id };
    super.getList(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : this.translate.instant("VISITES.ACTION.CATEGORY_ARCHIVED.TITLE") });
  }

  async addChild(item){
    let payload = { ...item, cat_question_id : item.cat_question_id };
    super.addChild(payload);
  }

  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : this.translate.instant("VISITES.ACTION.QUESTION_ARCHIVED.TITLE") });
  }
}
