import { db } from '$lib/db';
import { purchaseOrderItems, purchaseOrders } from '$lib/db/schema/purchase-order-schema';
import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { purchaseOrderItemSchema, purchaseOrderSchema } from '$lib/validation';
import { suppliers } from '$lib/db/schema/supplier-schema';
import { products } from '$lib/db/schema/product-schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	// const sessionId = event.cookies.get('sessionId');

	// const wew = await db.query.purchaseOrders.findMany({
	// 	where: eq(purchaseOrders.sessionId, sessionId ?? ''),
	// 	with: {
	// 		purchaseOrderItems: {
	// 			with: {
	// 				product: true
	// 			}
	// 		}
	// 	}
	// });

	const purchaseOrderItems = await db.query.purchaseOrderItems.findMany({
		with: {
			product: true
		}
	});

	return {
		purchaseOrderItems,
		suppliers: await db.select().from(suppliers),
		products: await db.select().from(products),
		addForm: await superValidate(zod(purchaseOrderItemSchema))
	};
};

export const actions: Actions = {
	addPurchaseOrderItem: async (event) => {
		const form = await superValidate(event, zod(purchaseOrderItemSchema));
		if (!form.valid) {
			console.error('Add Purchase Order Form Validation Failed:', form.errors);
			return fail(400, { form });
		}

		try {
			const existingOrder = await db.query.purchaseOrders.findFirst({
				where: eq(purchaseOrders.sessionId, event.cookies.get('sessionId') ?? '')
			});

			const randomSessionId = crypto.randomUUID();

			if (!existingOrder) {
				event.cookies.set('sessionId', randomSessionId, { path: '/' });
			}

			const orderId =
				existingOrder?.id ??
				(await db
					.insert(purchaseOrders)
					.values({
						sessionId: randomSessionId,
						supplierId: form.data.supplierId,
						status: 'draft'
					})
					.returning({ id: purchaseOrders.id })
					.then(([newOrder]) => newOrder.id));

			await db.insert(purchaseOrderItems).values({
				purchaseOrderId: orderId,
				productId: form.data.productId,
				quantity: form.data.quantity
			});
		} catch (error) {
			console.error('Error adding purchase order item:', error);
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
		try {
			await db.insert(purchaseOrders).values({
				sessionId: 'temp-session',
				orderDate: new Date(),
				supplierId: form.data.supplierId,
				status: 'pending'
			});
		} catch (error) {
			console.error('Error creating purchase order:', error);
			return fail(500, { form });
		}

		return { form };
	}
};
