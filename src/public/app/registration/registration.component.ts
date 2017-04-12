import { Component } from '@angular/core';
import { UsersService } from '../services/users-service';

@Component({
	selector: 'registration',
	templateUrl: './registration.component.html',
	providers: [ UsersService ]
})

export class RegistrationComponent { 
	user: any;

	constructor(private UsersService: UsersService) {
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
		this.UsersService.postUserToDB(this.user);
	}
}
