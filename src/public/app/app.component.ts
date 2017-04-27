import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication-service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
//   template: `<h1>Angular Works!</h1>`
})
export class AppComponent {

	private isAuthenticated: boolean;

	constructor(authService: AuthenticationService) {
		this.isAuthenticated = authService.isUserAuthenticated();

		authService.authenticationChange.subscribe((value: any) => {
			console.log('change:', value);
			this.isAuthenticated = value;
		});
	}
}
