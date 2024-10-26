import { db } from '$lib/db';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { customerSchema } from '$lib/validation';
import { customers } from '$lib/db/schema/customer-schema';

export const load = async () => {
	return {
		customers: await db.query.customers.findMany(),
		salesOrders: [
			{ id: 1, name: 'Sales Order 1', sku: '1234567890', qty: 10, price: 100, amount: 1000 }
		]
	};
};

export const actions = {
	addCustomer: async (event) => {
		const form = await superValidate(event, zod(customerSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			await db.insert(customers).values(form.data);
		} catch (error) {
			console.error('Error adding customer:', error);
			return fail(500, { form, message: 'Failed to add customer' });
		}
		return { form };
	}
};
