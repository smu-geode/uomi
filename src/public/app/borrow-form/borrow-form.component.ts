import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { UsersService } from '../services/users-service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Loan } from '../services/loan';

@Component({
	selector: 'borrow-form',
	templateUrl: './borrow-form.component.html',
	providers: [ AuthenticationService,
				 LoansService,
				 UsersService ]
})

export class BorrowFormComponent implements OnInit { 

	private newLoan: Loan = new Loan();
	private amount: string;
	private fromUser: object;
	@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
	private categories: object[];

	constructor(private authService: AuthenticationService,
				private loansService: LoansService,
				private usersService: UsersService,
				private router: Router,
				private route: ActivatedRoute) {
	
	}

	ngOnInit() {
		this.loansService.getCategories().subscribe(x => this.categories = x);
	}

	completeBorrow() {
		// convert amount string to cents
		if (this.isValidCurrenyString(this.amount)) {
			this.newLoan.amountCents = this.convertToCents(this.amount);
			console.log(this.newLoan.amountCents);

			this.newLoan.to = sessionStorage.user_id;

			// get user id for toUser
			let emailMatch: boolean = false;
			this.usersService.searchUserByEmail(""+this.fromUser)
			.subscribe(x => {
				console.log(x);
				if (x[0].email == this.fromUser) {
					this.newLoan.from = x[0].id;
					this.loansService.postNewLoan(+this.newLoan.from, +this.newLoan.to, 
						this.newLoan.amountCents, +this.newLoan.category)
						.subscribe(x => this.cancel(), x => console.log(x));
				} else {
					console.error("email does not match a user's email");
				}
			}, err => console.error(err));

		} else {
			console.error("invalid currency string");
		}
	}

	cancel() {
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
