import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ZoneService, TypeService, CatRisqueService, EquipementService } from '@app/core/services';
import { Type, Zone } from '@app/core/models';

@Component({
  selector: 'tf-ar-admin',
  templateUrl: './ar-admin.component.html',
  styleUrls: ['./ar-admin.component.scss']
})
export class ArAdminComponent implements OnInit {

  types : any[];

  parts = {
    'zones'   : { title : 'Zones', collapsed : true,  list : [], childCol : 6 },
    'risques' : { title : 'Risques', collapsed : true, list : [], childCol : 6  },
    // 'equipements' : {title : 'Equipements à prévoir sur le chantier', collapsed : false, list : [], childCol : 12}
  }
 

  constructor(private zoneService : ZoneService,
              private typeService : TypeService,
              private catRisqueService : CatRisqueService,
              private equipementService : EquipementService,
              private cdr: ChangeDetectorRef,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.getTypes();
    this.getCatRisques();
    // this.getEquipements();
  }


  getList(prop){
    return this.parts[prop].list;
  }

  setList(prop, list){
    this.parts[prop].list = list;
  }

  pushChild(prop, index, item){
    this.parts[prop].list[index].children.push(item);
  }



  /////////////////////////////////////
  ////// ZONES
  /////////////////////////////////////
  async getTypes(){
    let res = await this.typeService.getAllFromModel('Zone').toPromise();
    let types = res.result.data.map( (type:any) => {type.children = []; return type })
    this.setList('zones', types);
    this.getZones();
    this.cdr.markForCheck();
  }

  async getZones(){
    try {
      var res = await this.zoneService.getAll().toPromise();
      res.result.data.forEach( zone => {
        let index = this.getList('zones').findIndex(type => type.id === zone.type_id);
        this.pushChild('zones', index, zone);
      });
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }


  /////////////////////////////////////
  ////// Risques
  /////////////////////////////////////
  async getCatRisques(){
    try {
      var res = await this.catRisqueService.getAll().toPromise();
      let  list = res.result.data.map( item => item['children'] = item['risques'] );
      this.setList('risques', list);
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
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
