import { db } from '$lib/db';
import { inventoryItemSchema } from '$lib/validation';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { inventoryItems } from '$lib/db/schema/inventory-schema';
import { purchaseOrders } from '$lib/db/schema/purchase-order-schema';
import { eq } from 'drizzle-orm/sql';

export const load = async ({ url }) => {
	const pendingPurchaseOrders = await db.query.purchaseOrders.findMany({
		where: eq(purchaseOrders.poCode, url.searchParams.get('poCode') ?? ''),
		with: {
			items: {
				with: {
					product: true
				}
			},
			supplier: true
		}
	});
	return { purchaseOrders: pendingPurchaseOrders };
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
