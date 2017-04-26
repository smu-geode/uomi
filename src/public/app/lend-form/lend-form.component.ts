import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Loan } from '../services/loan';

@Component({
	selector: 'lend-form',
	templateUrl: './lend-form.component.html',
	providers: [ AuthenticationService,
				 LoansService ]
})

export class LendFormComponent implements OnInit { 

	private newLoan: Loan = new Loan();
	private amount: string;
	private toUser: object;
	private categories: string[] = ['Food', 'Bills', 'Entertainment', 'Transport', 'Other'];

	constructor(private authService: AuthenticationService,
				private loansService: LoansService,
				private router: Router,
				private route: ActivatedRoute) {
	
	}

	ngOnInit() {
		if (!this.authService.isUserAuthenticated()) {
			this.router.navigate(['/registration']);
		}
	}

	completeLend() {
		// convert amount string to cents - !!
		this.newLoan.amountCents = +this.amount;

		// get user id for toUser
		// this.newLoan.to = getIdForUser(this.toUser);
		this.newLoan.to = this.toUser;

		this.newLoan.from = sessionStorage.user_id;

		this.loansService.postNewLoan(+this.newLoan.from, +this.newLoan.to, 
			this.newLoan.amountCents, ""+this.newLoan.category)
			.subscribe(x => console.log(x));
		// ugly casting is ugly
	}

	// cancel() {
	// 	this.closeModal.emit();
	// }

}
