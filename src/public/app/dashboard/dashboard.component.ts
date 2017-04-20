import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users-service';
import { AuthenticationService } from '../services/authentication-service';

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	providers: [ UsersService,
				 AuthenticationService ]
})

export class DashboardComponent implements OnInit { 

	loans: any;

	constructor(private usersService: UsersService,
				private authService: AuthenticationService) {
		this.loans = {};
	}

	ngOnInit() {
		this.authService.rerouteIfNotAuthenticated('/registration');
		if (this.authService.isUserAuthenticated()) {
			this.loans = this.usersService.getLoans(this.authService.getCurrentUserId());
		}
	}

}
