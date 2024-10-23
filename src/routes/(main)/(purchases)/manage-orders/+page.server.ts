import { db } from '$lib/db';
import { purchaseOrderItems, purchaseOrders } from '$lib/db/schema/purchase-order-schema';
import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	purchaseOrderItemSchema,
	purchaseOrderSchema,
	type PurchaseOrderItemCookie
} from '$lib/validation';
import { suppliers } from '$lib/db/schema/supplier-schema';
import { products } from '$lib/db/schema/product-schema';
import { eq } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const existingOrder = getPurchaseOrder(cookies);

	const orderItems = await db.query.purchaseOrderItems.findMany({
		where: eq(purchaseOrderItems.purchaseOrderId, existingOrder?.id ?? 0),
		with: {
			product: true
		}
	});

	return {
		existingOrder,
		purchaseOrderItems: orderItems,
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
			const existingOrder = getPurchaseOrder(event.cookies);

			const orderId =
				existingOrder?.id ??
				(await db
					.insert(purchaseOrders)
					.values({
						supplierId: form.data.supplierId,
						status: 'draft'
					})
					.returning({ id: purchaseOrders.id })
					.then(([newOrder]) => newOrder.id));

			if (!existingOrder?.id) {
				event.cookies.set(
					'purchase_order_session',
					JSON.stringify({ id: orderId, supplierId: form.data.supplierId }),
					{
						path: '/'
					}
				);
			}

			await db.insert(purchaseOrderItems).values({
				purchaseOrderId: orderId,
				productId: form.data.productId,
				quantity: form.data.quantity
			});
		} catch (error) {
			console.error('Error adding purchase order item:', error);

			if (error instanceof Error) {
				return fail(500, { form, message: error.message });
			} else {
				return fail(500, { form, message: 'An unexpected error occurred' });
			}
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
			await db.update(purchaseOrders).set({
				poCode: 'PO-XY12',
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

const getPurchaseOrder = (cookies: Cookies) => {
	const orderCookie = cookies.get('purchase_order_session');
	const existingOrder: PurchaseOrderItemCookie | undefined = orderCookie
		? JSON.parse(orderCookie)
		: undefined;

	return existingOrder;
};
