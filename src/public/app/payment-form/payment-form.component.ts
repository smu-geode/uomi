import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { UsersService } from '../services/users-service';
import { Loan } from '../services/loan';

@Component({
	selector: 'payment-form',
	templateUrl: './payment-form.component.html',
	providers: [ AuthenticationService,
				 LoansService,
				 UsersService ]
})

export class PaymentFormComponent { 

	@Input() loan: Loan;

	private amount: string;
	private memo: string = '';

	errorString: string;
	isError: boolean = false;

	@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
	private categories: object[];

	constructor(private authService: AuthenticationService,
				private loansService: LoansService,
				private usersService: UsersService,
				private router: Router,
				private route: ActivatedRoute) {
	}

	completePayment() {
		if(!this.isValidCurrencyString(this.amount)) {
			console.log("Please enter a valid amount.");
			return;
		}

		let amountCents = this.convertToCents(this.amount);
		if (amountCents <= this.loan.amountCents) {
			this.loansService.addPaymentToLoan(this.loan, amountCents, this.memo)
				.subscribe(x => {
					this.isError = false;
					console.log("payment posted");
					this.cancel();
				});
		} else {
			this.errorString = "You cannot pay back more than you owe.";
			this.isError = true;
		}

	}

	cancel() {
		this.memo = '';
		this.amount = '';
		this.isError = false;
		this.errorString = '';
		this.closeModal.emit();
	}

	isValidCurrencyString(amount: string): boolean {
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
