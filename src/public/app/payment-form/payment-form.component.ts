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

	@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
	private categories: object[];

	constructor(private authService: AuthenticationService,
				private loansService: LoansService,
				private usersService: UsersService,
				private router: Router,
				private route: ActivatedRoute) {
	}

	completePayment() {
		if(!this.isValidCurrenyString(this.amount)) {
			console.error("Invalid amount for payment");
			return;
		}

		let amountCents = this.convertToCents(this.amount);
		this.loansService.addPaymentToLoan(this.loan, amountCents, this.memo)
			.subscribe(x => {
				console.log("payment posted");
				this.cancel();
			});

	}

	cancel() {
		this.memo = '';
		this.amount = '';
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
