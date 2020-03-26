// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TfDialogService {
	private tfDialog: any;
	private currentState: BehaviorSubject<boolean> = new BehaviorSubject(false);

	// Public properties
	constructor() {
		this.tfDialog = new KTDialog({type: 'loader', placement: 'top center', message: 'Loading ...'});
	}

	show() {
		this.currentState.next(true);
		this.tfDialog.show();
	}

	hide() {
		this.currentState.next(false);
		this.tfDialog.hide();
	}

	checkIsShown() {
		return this.currentState.value;
	}
}
