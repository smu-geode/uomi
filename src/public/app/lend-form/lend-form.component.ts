import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { UsersService } from '../services/users-service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Loan } from '../services/loan';

@Component({
	selector: 'lend-form',
	templateUrl: './lend-form.component.html',
	providers: [ AuthenticationService,
				 LoansService,
				 UsersService ]
})

export class LendFormComponent implements OnInit { 

	private newLoan: Loan = new Loan();
	private amount: string;
	private toUser: object;
	@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
	private categories: object[] = [
		{name: 'Food', identifier: 'category-food'}, 
		{name:'Bills', identifier: 'category-bills'}, 
		{name:'Entertainment', identifier: 'categroy-entertainment'}, 
		{name:'Transport', identifier: 'category-transport'}, 
		{name:'Other', identifier: 'category-other'}
	];

	constructor(private authService: AuthenticationService,
				private loansService: LoansService,
				private usersService: UsersService,
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

		this.newLoan.from = sessionStorage.user_id;

		// get user id for toUser
		this.usersService.searchUserByEmail(""+this.toUser)
		.subscribe(x => {console.log(x); this.newLoan.to = x[0].id; 
			this.loansService.postNewLoan(+this.newLoan.from, +this.newLoan.to, 
			this.newLoan.amountCents, ""+this.newLoan.category)
			.subscribe(x => this.cancel(), x => console.log(x));}, err => console.log(err));
		// ugly casting is ugly
	}

	cancel() {
		// this.modalService.closeModal(this.enclosingModalId);
		this.closeModal.emit();
	}

}
