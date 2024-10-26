import { db } from '$lib/db';
import { inventoryItemSchema } from '$lib/validation';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { inventoryItems } from '$lib/db/schema/inventory-schema';
export const load = async () => {
	const purchaseOrders = await db.query.purchaseOrders.findMany({
		with: {
			items: {
				with: {
					product: true
				}
			},
			supplier: true
		}
	});
	return { purchaseOrders };
};

export const actions = {
	recievePurchaseOrder: async (event) => {
		const form = await superValidate(event, zod(inventoryItemSchema));
		if (!form.valid) {
			console.error('Purchase Order Form Validation Failed:', form.errors);
			return fail(400, { form });
		}
		try {
			await db.insert(inventoryItems).values(form.data);
		} catch (error) {
			console.error('Error inserting purchase order:', error);
			return fail(500, { form });
		}
		return { form };
	}
};
