import { Serializable } from './serializable';

export class Loan implements Serializable<Loan> {

	id: number;
	amountCents: number;
	from: object;
	to: object;

	category: object;
	confirmed: boolean;
	details: string;

	confirmedAt: Date;
	completedAt: Date;
	createdAt: Date;
	updatedAt: Date;

	deserialize(input: object): Loan {
		let loan = new Loan();

		loan.id = input['id'];
		loan.amountCents = input['amount_cents'];

		loan.from = input['from'];
		loan.to = input['to'];

		loan.category = input['category'];
		loan.details = input['details'];
		loan.confirmed = input['confirmed'];

		loan.confirmedAt = input['confirmed_at'];
		loan.completedAt = input['completed_at'];
		loan.createdAt = input['created_at'];
		loan.updatedAt = input['updated_at'];

		return loan;
	}
}