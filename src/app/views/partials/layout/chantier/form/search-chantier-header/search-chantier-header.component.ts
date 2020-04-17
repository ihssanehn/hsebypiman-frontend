import { Component, OnInit, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Chantier } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { ChantierService } from '@app/core/services';
import { first } from 'rxjs/operators';


@Component({
  selector: 'tf-search-chantier-header',
  templateUrl: './search-chantier-header.component.html',
  styleUrls: ['./search-chantier-header.component.scss']
})
export class SearchChantierHeaderComponent implements OnInit {

  chantiers: Chantier[];
  selectedChantier: Chantier;
  @Output() chantierSelected = new EventEmitter<Number>();

  constructor(
    private chantierService:ChantierService,
    private authService:AuthService,
		private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getChantiers();
  }


  async getChantiers(){
    this.chantiers = await this.chantierService.getList().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  selectChantier(){
    this.chantierSelected.emit(this.selectedChantier.id);
  }
}
