// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../core/_base/layout';
// Object-Path
import * as objectPath from 'object-path';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@env/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { version } from '@app/../../package.json';

@Component({
	selector: 'tf-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],

})
export class FooterComponent implements OnInit {
	// Public properties
	version = version;
	today: number = Date.now();
	fluid: boolean;
	cguPath;
	iframeHeight = window.innerHeight - 300
	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayouConfigService
	 */
	constructor(
		private layoutConfigService: LayoutConfigService, 
		private modalService: NgbModal,
		private sanitize: DomSanitizer
	) {

		this.cguPath = this.sanitize.bypassSecurityTrustResourceUrl(environment.apiBaseUrl+"cgu")
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		const config = this.layoutConfigService.getConfig();

		// footer width fluid
		this.fluid = objectPath.get(config, 'footer.self.width') === 'fluid';
		console.log(this.cguPath);
	}

	openCguModal(cguModal){
		this.modalService.open(cguModal,  {size:'xl', scrollable:false, centered :true, windowClass:'tf-quizz-modal__window'})
	}

}
