import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ZoneService, TypeService, CatRisqueService, EquipementService } from '@app/core/services';

@Component({
  selector: 'tf-ar-admin',
  templateUrl: './ar-admin.component.html',
  styleUrls: ['./ar-admin.component.scss']
})
export class ArAdminComponent implements OnInit {

  types : any[];

  parts : any;
 

  constructor(private zoneService : ZoneService,
              public typeService : TypeService,
              private catRisqueService : CatRisqueService,
              private equipementService : EquipementService,
              private cdr: ChangeDetectorRef,
              private modalService: NgbModal) {

      
                
  }

  ngOnInit() {
    // this.getTypes();
    // this.getCatRisques();
    // this.getEquipements();
  }


  getList(prop){
    return this.parts[prop].list;
  }

  setList(prop, list){
    this.parts[prop].list = list;
  }

  editItem(prop, index, item){
    this.parts[prop].list[index] = item;
  }

  pushChild(prop, index, item){
    this.parts[prop].list[index].children.push(item);
  }


  /////////////////////////////////////
  ////// Equipement
  /////////////////////////////////////

  async getEquipements(){
    try {
      var res = await this.equipementService.getAll().toPromise();
      let list = [{children  : res.result.data }];
      this.setList('equipements', list);
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }


  /////////////////////////////////////
  ////// Common
  /////////////////////////////////////

  unsorted() { }



}
