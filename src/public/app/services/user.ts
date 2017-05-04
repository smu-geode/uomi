import { Serializable } from '../shared/serializable';

export class User implements Serializable<User> {

	id: number;
	email: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;

	deserialize(input: object) {
		let user = new User();

		user.id = input['id'];
		user.email = input['email'];
		user.name = input['name'];

		user.createdAt = this.castDate(input['created_at']);
		user.updatedAt = this.castDate(input['updated_at']);

		return user;
	}

	castDate(dateString: string): Date {
		if(dateString === '2000-01-01 00:00:00') {
			return null;
		} else {
			return new Date(dateString);
		}
	}
}
