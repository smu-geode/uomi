import { Component } from '@angular/core';
import { UsersService } from '../services/users-service';
import { AuthenticationService } from '../services/authentication-service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
	selector: 'registration',
	templateUrl: './registration.component.html',
	providers: [ UsersService,
				 AuthenticationService ]
})

export class RegistrationComponent { 
	user: any;

	constructor(private usersService: UsersService,
				private authService: AuthenticationService,
				private router: Router,
				private route: ActivatedRoute ) {
		this.user = {
			email: '',
			password: '',
			passwordVerify: ''
		};
	}

	createUser() {
		// call to users service
		delete this.user.passwordVerify;
		this.usersService.signUp(this.user)
			.subscribe(valid => this.authService.logIn(this.user),
				error => this.router.navigate(['/registration']));
	}
}
