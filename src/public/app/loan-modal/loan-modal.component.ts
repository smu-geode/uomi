import { Component, OnInit, Input } from '@angular/core';
import { LoansService } from '../services/loans-service';
import { AuthenticationService } from '../services/authentication-service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
	selector: 'loan-modal',
	templateUrl: './loan-modal.component.html',
	providers: [ LoansService ]
})

export class LoanModalComponent implements OnInit { 

	@Input() isActive = false;
	@Input() actionText = 'Lend';

	constructor(private loansService: LoansService,
				private authService: AuthenticationService,
				private router: Router,
				private route: ActivatedRoute) {
	
	}

	ngOnInit() {
		if (!this.authService.isUserAuthenticated()) {
			this.router.navigate(['/registration']);
		}
	}

	openModal() {
		this.isActive = true;
	}

	closeModal() {
		this.isActive = false;
	}

	setActionText(actionText: string) {
		this.actionText = actionText;
	}

}
