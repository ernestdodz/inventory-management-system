import { db } from '$lib/db';
import { purchaseOrders } from '$lib/db/schema/purchase-order-schema';
import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { purchaseOrderSchema } from '$lib/validation';
import { suppliers } from '$lib/db/schema/supplier-schema';
import { products } from '$lib/db/schema/product-schema';

export const load: PageServerLoad = async () => {
	const purchaseOrders = await db.query.purchaseOrders.findMany({
		with: {
			product: true,
			supplier: true
		}
	});

	return {
		purchaseOrders,
		suppliers: await db.select().from(suppliers),
		products: await db.select().from(products),
		addForm: await superValidate(zod(purchaseOrderSchema))
	};
};

export const actions: Actions = {
	addPurchaseOrder: async (event) => {
		const form = await superValidate(event, zod(purchaseOrderSchema));
		if (!form.valid) {
			console.error('Add Purchase Order Form Validation Failed:', form.errors);
			return fail(400, { form });
		}

		try {
			await db.insert(purchaseOrders).values({
				supplierId: form.data.supplierId,
				productId: form.data.productId,
				quantity: form.data.quantity
			});
		} catch (error) {
			console.error('Error adding purchase order:', error);
			return fail(500, { form });
		}

		return { form };
	},
	createPurchaseOrder: async (event) => {
		const form = await superValidate(event, zod(purchaseOrderSchema));
		if (!form.valid) {
			console.error('Create Purchase Order Form Validation Failed:', form.errors);
			return fail(400, { form });
		}
		return { form };
	}
};
