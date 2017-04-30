import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../services/users-service';
import { AuthenticationService } from '../services/authentication-service';

@Component({
	selector: 'registration',
	templateUrl: './registration.component.html',
	providers: [ UsersService,
				 AuthenticationService ]
})

export class RegistrationComponent { 
	user: any;
	passwordVerify: string;
	serverError: string;
	isServerError: boolean = false;

	constructor(private usersService: UsersService,
				private authService: AuthenticationService,
				private router: Router,
				private route: ActivatedRoute ) {
		this.user = {
			email: '',
			password: ''
		};
	}

	createUser() {
		// call to users service
		delete this.user.passwordVerify;
		this.usersService.signUp(this.user)
			.subscribe(valid => {
				this.isServerError = false;
				this.authService.logIn(this.user).subscribe(res => {
					sessionStorage.setItem('user_id', res.data.user_id);
					sessionStorage.setItem('token', res.data.token);
					this.authService.isAuthenticated.next(true);
					this.router.navigate(['/dashboard']);
				}, err => {
					console.error(err);
				})
			}, error => {
				let errors = JSON.parse(error);
				this.serverError = errors['data']['errors'][0];
				this.isServerError = true;
				this.router.navigate(['/registration'])});
	}
}
