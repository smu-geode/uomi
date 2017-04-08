import { Component } from '@angular/core';

@Component({
	selector: 'registration',
	templateUrl: './registration.component.html'
})

export class RegistrationComponent { 
	user: any;

	constructor() {
		this.user = {
			email: '',
			password: '',
			passwordVerify: ''
		};
	}

	createUser() {
		// call to users service
	}
}
