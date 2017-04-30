import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { UsersService } from '../services/users-service';
import { AuthenticationService } from '../services/authentication-service';
import { LoansService } from '../services/loans-service';
import { ModalService } from '../services/modal-service';
import { Loan } from '../services/loan';
import * as c3 from 'c3';

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	providers: [ 
		UsersService,
		AuthenticationService,
		LoansService,
		ModalService
	]
})
export class DashboardComponent implements AfterViewInit { 

	isLoaded: boolean = false;

	loans: Loan[] = [];
	loansFromMe: Loan[] = [];
	loansToMe: Loan[] = [];
	errorMessage: any;

	lentTotal: number;
	borrowedTotal: number;

	loanIdForPayment: number;

	@ViewChildren('lentChart') lentChartElements: QueryList<ElementRef>;
	@ViewChildren('borrowedChart') borrowedChartElements: QueryList<ElementRef>;

	lentChart: c3.ChartAPI;
	borrowedChart: c3.ChartAPI;

	lentChartReady: boolean = false;
	borrowedChartReady: boolean = false;

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

	ngAfterViewInit() {
		this.lentChartElements.changes.subscribe(_ => {
			if(this.lentChartElements.length) {
				this.lentChartReady = true;
				this.tryToLoadCharts();
			}
		});
		this.borrowedChartElements.changes.subscribe(_ => {
			if(this.borrowedChartElements.length) {
				this.borrowedChartReady = true;
				this.tryToLoadCharts();
			}
		});
	}

	didLoadLoanData(loanData: object) {
		this.loansFromMe = loanData['from_me'];
		this.loansFromMe.forEach((l: Loan) => l.fromMe = true );

		this.loansToMe = loanData['to_me'];
		this.loansToMe.forEach((l: Loan) => l.fromMe = false );

		this.loans = this.loansFromMe.concat(this.loansToMe);

		this.lentTotal = this.loansTotal(this.loansFromMe);
		this.borrowedTotal = this.loansTotal(this.loansToMe);

		this.isLoaded = true;
	}

	loansTotal(loans: Loan[]): number {
		let sum = loans.map(l => l.balance).reduce((S, s) => S+s, 0);
		return sum;
	}

	tryToLoadCharts() {
		if(!this.lentChartReady || !this.borrowedChartReady) {
			return;
		}

		let lentChartElement = this.lentChartElements.first.nativeElement;
		let borrowedChartElement = this.borrowedChartElements.first.nativeElement;

		let chartFormat = {
			type : 'donut',
			columns: [ ['A', 50], ['B', 50] ]
		};

		this.lentChart = c3.generate({
			bindto: lentChartElement,
			data: chartFormat
		});

		this.borrowedChart = c3.generate({
			bindto: borrowedChartElement,
			data: chartFormat
		});

		setTimeout(() => {
			let mockData = [
				['A', 300, 100, 250, 150, 300, 150, 500],
				['B', 100, 200, 150, 50, 100, 250]
			]
			this.lentChart.load({ columns: mockData });
			this.borrowedChart.load({ columns: mockData });
		}, 1000);
	}

	openModal(id: string) {
		console.log("open modal: " + id);
		this.modalService.openModal(id);
	}

	openPaymentModal(loanId: number) {
		this.loanIdForPayment = loanId;
		this.modalService.openModal('payment-modal');
	}

	closeModal(id: string) {
		this.modalService.closeModal(id);
	}

	didClickLogOutButton() {
		this.authService.logOut();
	}

}
