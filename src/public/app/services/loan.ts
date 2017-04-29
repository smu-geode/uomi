import { Serializable } from '../shared/serializable';
import { User } from './user';

export class Loan implements Serializable<Loan> {

	id: number;
	amountCents: number;
	balance: number;
	fromMe: boolean;
	from: User;
	to: User;

	category: object;
	confirmed: boolean;
	details: string;

	confirmedAt: Date;
	completedAt: Date;
	createdAt: Date;
	updatedAt: Date;

	deserialize(input: object) {
		let loan = new Loan();
		let user = new User();

		loan.id = input['id'];
		loan.amountCents = input['amount_cents'];
		loan.balance = input['balance'];

		loan.from = user.deserialize(input['from']);
		loan.to = user.deserialize(input['to']);
		loan.fromMe = null;

		loan.category = input['category'];
		loan.details = input['details'];
		loan.confirmed = input['confirmed'];

		loan.confirmedAt = this.castDate(input['confirmed_at']);
		loan.completedAt = this.castDate(input['completed_at']);
		loan.createdAt = this.castDate(input['created_at']);
		loan.updatedAt = this.castDate(input['updated_at']);

		return loan;
	}

	castDate(dateString: string): Date {
		if(dateString === '2000-01-01 00:00:00') {
			return null;
		} else {
			return new Date(dateString);
		}
	}
}