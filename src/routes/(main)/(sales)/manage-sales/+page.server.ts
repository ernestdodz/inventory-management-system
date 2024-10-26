import { db } from '$lib/db';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { salesOrderCartItemSchema } from '$lib/validation';
import { customers } from '$lib/db/schema/customer-schema';
import { products } from '$lib/db/schema/product-schema';
import { salesOrderCartItems } from '$lib/db/schema/sales-order-schema';

export const load = async () => {
	const salesOrdersItems = await db.query.salesOrderCartItems.findMany({
		with: {
			product: true
		}
	});

	return {
		salesOrdersItems,
		customers: await db.select().from(customers),
		products: await db.select().from(products),
		addForm: await superValidate(zod(salesOrderCartItemSchema))
	};
};

export const actions = {
	addSalesItem: async (event) => {
		const form = await superValidate(event, zod(salesOrderCartItemSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			await db.insert(salesOrderCartItems).values(form.data);
		} catch (error) {
			console.error('Error adding sales item:', error);
			return fail(500, { form, message: 'Failed to add customer' });
		}
		return { form };
	}
};
