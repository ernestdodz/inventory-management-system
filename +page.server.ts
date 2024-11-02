import { db } from '$lib/db';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { salesOrderCartItemSchema } from '$lib/validation';
import { customers } from '$lib/db/schema/customer-schema';
import { products } from '$lib/db/schema/product-schema';
import { salesOrderCartItems } from '$lib/db/schema/sales-order-schema';
import { salesOrderCarts } from '$lib/db/schema/sales-order-schema';
import { eq } from 'drizzle-orm';
import { error, type Cookies } from '@sveltejs/kit';
import { inventoryItems } from '$lib/db/schema/inventory-schema';
import type { SalesCartOrderItemCookie } from '$lib/types.js';

export const load = async ({ cookies }) => {
	const existingOrder = getSalesCartOrder(cookies);

	const salesOrdersItems = await db.query.salesOrderCartItems.findMany({
		where: eq(salesOrderCartItems.cartId, existingOrder?.id ?? 0),
		with: {
			product: true
		}
	});

	return {
		existingOrder,
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
			const existingOrder = getSalesCartOrder(event.cookies);

			const orderCartId =
				existingOrder?.id ??
				(await db
					.insert(salesOrderCarts)
					.values({
						customerId: form.data.customerId
					})
					.returning({ id: salesOrderCarts.id })
					.then(([newOrder]) => newOrder.id));

			if (!existingOrder?.id) {
				event.cookies.set(
					'sales_order_cart_session',
					JSON.stringify({ id: orderCartId, customerId: form.data.customerId }),
					{
						path: '/'
					}
				);
			}

			await db.insert(salesOrderCartItems).values({
				cartId: orderCartId ?? 0,
				productId: form.data.productId,
				quantity: form.data.quantity,
				sellingPrice: form.data.sellingPrice
			});
		} catch (error) {
			console.error('Error adding sales item:', error);
			return fail(500, { form, message: 'Failed to add sales item' });
		}
		return { form };
	},
	createSales: async (event) => {
		try {
			const currentCart = getSalesCartOrder(event.cookies);

			const salesOrder = await db.query.salesOrderCarts.findFirst({
				where: eq(salesOrderCarts.id, currentCart?.id ?? 0),
				with: {
					items: true
				}
			});

			if (!salesOrder) {
				error(404, 'Sales order not found');
			}

			// Check stock availability for all items first
			for (const item of salesOrder.items) {
				const existingItem = await db.query.inventoryItems.findFirst({
					where: eq(inventoryItems.productId, item.productId)
				});

				const availableStock = (existingItem?.stockIn ?? 0) - (existingItem?.stockOut ?? 0);
				if (availableStock < item.quantity) {
					error(
						400,
						`Insufficient stock for product ID ${item.productId}. Available: ${availableStock}, Requested: ${item.quantity}`
					);
				}
			}

			for (const item of salesOrder.items) {
				const existingItem = await db.query.inventoryItems.findFirst({
					where: eq(inventoryItems.productId, item.productId)
				});

				if (existingItem) {
					await db
						.update(inventoryItems)
						.set({
							stockOut: (existingItem?.stockOut ?? 0) + item.quantity
						})
						.where(eq(inventoryItems.id, existingItem?.id ?? 0));
				}

				await db.delete(salesOrderCartItems).where(eq(salesOrderCartItems.id, item.id));
			}

			event.cookies.delete('sales_order_cart_session', { path: '/' });
		} catch (err) {
			console.error('Error creating sales order:', err);

			return fail(500, { message: 'An unexpected error occurred' });
		}
		return { message: 'Sales order created successfully' };
	}
};

const getSalesCartOrder = (cookies: Cookies) => {
	const orderCookie = cookies.get('sales_order_cart_session');
	const existingOrder: SalesCartOrderItemCookie | undefined = orderCookie
		? JSON.parse(orderCookie)
		: undefined;

	return existingOrder;
};
