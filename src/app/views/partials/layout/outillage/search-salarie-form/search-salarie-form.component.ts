import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService, User } from '@app/core/auth';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'tf-search-salarie-form',
  templateUrl: './search-salarie-form.component.html',
  styleUrls: ['./search-salarie-form.component.scss']
})
export class SearchSalarieFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() parent: string;
  @Input() origin: string;
  

  @Output() onUserSelected = new EventEmitter();
  searchControl: FormControl = new FormControl();
  filteredSalaries : Observable<User[]>
  salaries: User[];
  salarie : User;
  constructor(private salarieService : AuthService) { }

  async ngOnInit() {
    this.salaries = (await this.salarieService.getList().toPromise()).result.data;
    this.initFilteredSalaries()
  }


  onSubmit(){
    this.onUserSelected.emit(this.salarie);
  }


  async initFilteredSalaries(){
    var res = await this.salarieService.getList().toPromise();
    this.salaries = res.result.data;
    this.filteredSalaries = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Array<User> {
    const filterValue = value;
    return this.salaries.filter(user => 
      this._normalizeValue(user.nom + user.prenom).includes(filterValue)
    );
  }

  private _normalizeValue(value: String): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  displayFn(user: User): String {
    return user ? user.nom +' '+ user.prenom : '';
  }
}
