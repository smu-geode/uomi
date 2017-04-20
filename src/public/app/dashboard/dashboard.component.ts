import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users-service';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	providers: [ UsersService,
				 AuthenticationService,
				 LoansService ]
})

export class DashboardComponent implements OnInit { 

	private loans: object[] = [];
	private errorMessage: any;

	constructor(private usersService: UsersService,
				private authService: AuthenticationService,
				private loansService: LoansService) {}

	ngOnInit() {
		this.authService.rerouteIfNotAuthenticated('/registration');

		let userId = this.authService.getCurrentUserId();
		this.loansService.getLoansForUser(userId).subscribe(
			loans => (this.loans = loans) && console.log(this.loans),
			error => this.errorMessage = <any>error
		);
	}

}
