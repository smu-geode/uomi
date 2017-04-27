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

	completeBorrow() {
		// convert amount string to cents - !!
		this.newLoan.amountCents = +this.amount;

		this.newLoan.to = sessionStorage.user_id;

		// get user id for fromUser
		this.usersService.searchUserByEmail(""+this.fromUser)
		.subscribe(x => {console.log(x); this.newLoan.from = x[0].id; 
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
