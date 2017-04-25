import { Component, OnInit, Input, Output, OnDestroy, ElementRef } from '@angular/core';
import { ModalService } from '../services/modal-service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
	selector: 'modal',
	template: 
	`
	<div class="modal-container" *ngIf="isOpen">
		<div 
		 *ngIf="isOpen"
		 [@isOpenState]
		 class="modal"
		>
			<header class="modal-header">
				<button class="button button-link modal-header-left-button" (click)="closeModal()">Close</button>
				<h3 class="modal-title">{{ title || '' }}</h3>
			</header>
			<ng-content></ng-content>
		</div>
	</div>
	`,
	animations: [
		trigger('isOpenState', [
			state('in', style({transform: 'translateY(0)'})),
			transition(':enter', [ style({transform: 'translateY(100vh)'}), animate(330) ]),
			transition(':leave', [ animate(330, style({transform: 'translateY(100vh)'})) ])
		])
	]
})

export class ModalComponent implements OnInit { 

	@Input() isOpen = false;
	@Input() id: string;
	@Input() title: string;
	
	constructor(private modalService: ModalService) {}

	ngOnInit() {
		if(!this.id) {
			console.error("An instance of ModalComponent must have an ID ( <modal id=\"your-id\"></modal> )");
			return;
		}
		this.modalService.addModal(this);
	}

	ngOnDestroy() {
		this.modalService.removeModal(this.id);
		this.isOpen = false;
	}

	openModal() {
		this.isOpen = true;
	}

	closeModal() {
		this.isOpen = false;
	}

}
