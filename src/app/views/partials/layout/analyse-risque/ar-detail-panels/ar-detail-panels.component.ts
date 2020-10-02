import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Ar, CatRisque, Equipement } from '@app/core/models';
import { Subscription } from 'rxjs';
import { CatRisqueService, EquipementService, ZoneService } from '@app/core/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tf-ar-detail-panels',
  templateUrl: './ar-detail-panels.component.html',
  styleUrls: ['./ar-detail-panels.component.scss']
})
export class ArDetailPanelsComponent implements OnInit {

  @Input() ar: Ar;

  @Input() isExpanded : boolean;

  @Input() isDisableToggle : boolean;

  displayedColumns: string[] = ['risks', 'actions', 'comments'];
	risksList : Array<CatRisque>;
  arRisksList : Array<CatRisque> = [];
  equipementList : Array<Equipement>;
  zonesList : Array<any>;
  days: any[] = [];
  
  loaded = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
    private cdr: ChangeDetectorRef,
    private catRisqueService: CatRisqueService,
		private equipementService: EquipementService,
		private zoneService: ZoneService,
  ) 
  {
    this.getCatRisques();
		this.getEquipements();
		this.getZones();
  }

  ngOnInit() {
	  this.days['Lundi'] = 'ARS.DAYS.MON';
	  this.days['Mardi'] = 'ARS.DAYS.TUE';
	  this.days['Mercredi'] = 'ARS.DAYS.WED';
	  this.days['Jeudi'] = 'ARS.DAYS.THU';
	  this.days['Vendredi'] = 'ARS.DAYS.FRI';
	  this.days['Samedi'] = 'ARS.DAYS.SAT';
	  this.days['Dimanche'] = 'ARS.DAYS.SUN';
  }

  async getCatRisques(){
		var res = await this.catRisqueService.getAll().toPromise();
		this.risksList = res.result.data;
		this.cdr.markForCheck();
	}

	async getEquipements(){
		var res = await this.equipementService.getAll().toPromise();
		this.equipementList = res.result.data;
		this.cdr.markForCheck();
	}

	async getZones(){
		var res = await this.zoneService.getList().toPromise();
		this.zonesList = res.result.data;
		this.cdr.markForCheck();
  }
  

  onRiskIsChecked(riskId){
		const ids = this.ar.risques.map(item => item.id);
		return ids.includes(riskId);
	}
	
	onEquipementIsChecked(equipementId){
		const ids = this.ar.equipements.map(item => item.id);
		return ids.includes(equipementId);
	}

	onZoneIsChecked(zoneId){
		const ids = this.ar.zones.map(item => item.id);
		return ids.includes(zoneId);
	}

	getCommentValue(id){
		var commentValue = '';
		var cat_risques = this.ar.cat_risques.filter(x=>x.id == id);
		if(cat_risques.length > 0){
			commentValue = cat_risques[0].commentaire;
		}
		return commentValue;
  }
  

  isChecked(controlName: string){
    return this.ar[controlName] == '1';
  }
}
