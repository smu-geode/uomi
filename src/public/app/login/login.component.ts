import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	providers: [ AuthenticationService ]
})

export class LoginComponent { 
	user: any;
	incorrect: boolean;

	constructor(private authService: AuthenticationService,
				private router: Router,
				private route: ActivatedRoute ) {
		this.user = {
			email: '',
			password: ''
		};
		this.incorrect = false;
	}

	authenticateUser() {
		// call to users service
		console.log('auth user');
		this.authService.logIn(this.user);
	}
}
