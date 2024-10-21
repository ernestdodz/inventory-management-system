import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { customerSchema } from '$lib/validation';
import { customers } from '$lib/db/schema';

export const load: PageServerLoad = async () => {
	const customers = await db.query.customers.findMany();

	return {
		customers,
		form: await superValidate(zod(customerSchema))
	};
};

export const actions: Actions = {
	addCustomer: async (event) => {
		const form = await superValidate(event, zod(customerSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		await db.insert(customers).values(form.data);
		return { form };
	}
};
