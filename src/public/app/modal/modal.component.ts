import { Component, OnInit, Input, Output, OnDestroy, ElementRef } from '@angular/core';
import { ModalService } from '../services/modal-service';
import { AuthenticationService } from '../services/authentication-service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
	selector: 'modal',
	template: `<div [class]="classes">
				<button (click)="closeModal()">Close</button>
				<ng-content></ng-content>
				</div>`
})

export class ModalComponent implements OnInit { 

	@Input() isActive = false;
	@Input() id: string;
	private classes: string = "modal-close";
	// @Input() modalContent: string;
	
	constructor(private modalService: ModalService,
				private authService: AuthenticationService,
				private router: Router,
				private route: ActivatedRoute) {
	
	}

	ngOnInit() {
		if (!this.authService.isUserAuthenticated()) {
			this.router.navigate(['/registration']);
		}

		if(!this.id) {
			console.error("Modal must have id");
			return;
		}

		this.modalService.addModal(this);
	}

	ngOnDestroy() {
		this.modalService.removeModal(this.id);
		this.isActive = false;
	}

	openModal() {
		this.isActive = true;
		this.classes = "modal-open"
	}

	closeModal() {
		this.isActive = false;
		this.classes = "modal-close"
	}

}
