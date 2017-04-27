import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
	selector: 'front-page',
	templateUrl: './front-page.component.html',
	providers: [ AuthenticationService ]
})

export class FrontPageComponent implements OnInit { 

	constructor(private authService: AuthenticationService,
				private router: Router,
				private route: ActivatedRoute) {}

	ngOnInit() {
		this.authService.rerouteIfAuthenticated('/dashboard');
		this.authService.rerouteIfNotAuthenticated('/registration');
	}

}
