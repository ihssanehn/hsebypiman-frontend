import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Signature } from '@app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'tf-signature-list',
  templateUrl: './signature-list.component.html',
  styleUrls: ['./signature-list.component.scss']
})
export class SignatureListComponent implements OnInit {

  private _signatures = new BehaviorSubject<Signature[]>([]);
  @Input()
  set dataSource(value) {
      this._signatures.next(value);
  };
  get dataSource() {
    return this._signatures.getValue();
  }

  displayedColumns: string[] = [
    'date', 
    'fullname', 
    'entreprise', 
    'comments', 
    'signature'
  ];
  signatures : Array<Signature>;
  errors;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    this._signatures
      .subscribe(
        x => {
          if(this.dataSource)
            this.signatures = this.dataSource;
        }
      );

  }

}
