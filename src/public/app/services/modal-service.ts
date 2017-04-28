import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ModalService { 
	private modals: any[] = [];

	addModal(newModal: any) {
		this.modals.push(newModal);
	}

	removeModal(id: string) {
		let toRemove = this.modals.filter(m => m.id == id)[0];
		this.modals.splice(this.modals.indexOf(toRemove), 1);
	}

	openModal(id: string) {
		let toOpen = this.modals.filter(m => m.id == id)[0];
		toOpen.openModal();
	}

	closeModal(id: string) {
		let toClose = this.modals.filter(m => m.id == id)[0];
		toClose.closeModal();
	}

}