import { Component, OnInit } from '@angular/core';
// import { LoanModalComponent } from '../loan-modal/loan-modal.component';
// import { ModalComponent } from '../modal/modal.component';
import { UsersService } from '../services/users-service';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { ModalService } from '../services/modal-service';
import { Loan } from '../services/loan';

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	providers: [ UsersService,
				 AuthenticationService,
				 LoansService,
				 ModalService/*,
				 LoanModalComponent*/ ],
	// changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent implements OnInit { 

	loans: Loan[] = [];
	loansFromMe: Loan[] = [];
	loansToMe: Loan[] = [];
	errorMessage: any;

	lentTotal: number;
	borrowedTotal: number;

	constructor(private usersService: UsersService,
				private authService: AuthenticationService,
				private loansService: LoansService,
				private modalService: ModalService) {}

	ngOnInit() {
		this.authService.rerouteIfNotAuthenticated('/registration');

		let userId = this.authService.getCurrentUserId();
		this.loansService.getLoansForUser(userId).subscribe(
			data => this.didLoadLoanData(data),
			error => this.errorMessage = <any>error
		);
	}

	didLoadLoanData(loanData: object) {
		this.loansFromMe = loanData['from_me'];
		this.loansFromMe.forEach((l: Loan) => l.fromMe = true );

		this.loansToMe = loanData['to_me'];
		this.loansToMe.forEach((l: Loan) => l.fromMe = false );

		this.loans = this.loansFromMe.concat(this.loansToMe);

		this.lentTotal = this.loansTotal(this.loansFromMe);
		this.borrowedTotal = this.loansTotal(this.loansToMe);
		console.log(this.loans);
	}

	loansTotal(loans: Loan[]): number {
		console.warn('DashboardComponent.loansTotal only sums initial loan amountCents. (TODO)');
		let sum = loans.map(l => l.amountCents).reduce((S, s) => S+s, 0);
		return sum;
	}

	openModal(id: string) {
		console.log("open modal: " + id);
		this.modalService.openModal(id);
	}

}
