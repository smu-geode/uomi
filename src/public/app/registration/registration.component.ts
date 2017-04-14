import { Component } from '@angular/core';
import { UsersService } from '../services/users-service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
	selector: 'registration',
	templateUrl: './registration.component.html',
	providers: [ UsersService ]
})

export class RegistrationComponent { 
	user: any;

	constructor(private usersService: UsersService,
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
		console.log('create user');
		delete this.user.passwordVerify;
		this.usersService.postUserToDB(this.user);
		// if (true) { // change condition to verify user
		// 	document.cookie = "isAuthenticated=true";
		// 	this.router.navigate(['/dashboard']);
		// }
	}
}
