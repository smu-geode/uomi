import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { UsersService } from '../services/users-service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Loan } from '../services/loan';

@Component({
	selector: 'payment-form',
	templateUrl: './payment-form.component.html',
	providers: [ AuthenticationService,
				 LoansService,
				 UsersService ]
})

export class PaymentFormComponent implements OnInit { 

	@Input() loanId: number;
	private currentLoan: Loan = new Loan();
	private amount: string;
	private toUser: object;
	@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
	private categories: object[];

	constructor(private authService: AuthenticationService,
				private loansService: LoansService,
				private usersService: UsersService,
				private router: Router,
				private route: ActivatedRoute) {
	
	}

	ngOnInit() {

	}

	ngOnChange() {
		this.loansService.getLoanById(this.loanId).subscribe(x => this.currentLoan = x as Loan);
	}

	cancel() {
		// this.modalService.closeModal(this.enclosingModalId);
		this.closeModal.emit();
	}

	isValidCurrenyString(amount: string): boolean {
		let regex = /^\d+(?:\.\d{0,2})?$/;
		return regex.test(amount);
	}

	convertToCents(amount: string): number {
		if (amount.split('.').length == 2) {
			return (+amount.split('.')[0] * 100) + (+amount.split('.')[1].substring(0,2));
		} else if (amount.split('.').length == 1) {
			return +amount.split('.')[0] * 100;
		}
		return -1;	
	}

}