import { db } from '$lib/db';
import {
	purchaseOrderCartItems,
	purchaseOrderCarts,
	purchaseOrderItems,
	purchaseOrders
} from '$lib/db/schema/purchase-order-schema';
import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { purchaseOrderCartItemSchema, purchaseOrderItemSchema } from '$lib/validation';
import { suppliers } from '$lib/db/schema/supplier-schema';
import { products } from '$lib/db/schema/product-schema';
import { eq } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';
import type { PurchaseOrderItemCookie } from '$lib/types';

export const load: PageServerLoad = async ({ cookies }) => {
	const existingOrder = getPurchaseOrder(cookies);

	const cartItems = await db.query.purchaseOrderCartItems.findMany({
		where: eq(purchaseOrderCartItems.cartId, existingOrder?.id ?? 0),
		with: {
			product: true
		}
	});

	return {
		existingOrder,
		purchaseOrderItems: cartItems,
		suppliers: await db.select().from(suppliers),
		products: await db.select().from(products),
		addForm: await superValidate(zod(purchaseOrderItemSchema))
	};
};

export const actions: Actions = {
	addPurchaseCartItem: async (event) => {
		const form = await superValidate(event, zod(purchaseOrderCartItemSchema));
		if (!form.valid) {
			console.error('Add Purchase Order Form Validation Failed:', form.errors);
			return fail(400, { form });
		}

		try {
			const existingOrder = getPurchaseOrder(event.cookies);

			const orderCartId =
				existingOrder?.id ??
				(await db
					.insert(purchaseOrderCarts)
					.values({
						supplierId: form.data.supplierId
					})
					.returning({ id: purchaseOrders.id })
					.then(([newOrder]) => newOrder.id));

			if (!existingOrder?.id) {
				event.cookies.set(
					'purchase_cart_session',
					JSON.stringify({ id: orderCartId, supplierId: form.data.supplierId }),
					{
						path: '/'
					}
				);
			}

			await db.insert(purchaseOrderCartItems).values({
				cartId: orderCartId,
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
		try {
			const currentCart = getPurchaseOrder(event.cookies);

			const cart = await db.query.purchaseOrderCarts.findFirst({
				where: eq(purchaseOrderCarts.id, currentCart?.id ?? 0),
				with: {
					items: true
				}
			});

			if (!cart) {
				return fail(400, { message: 'Cart not found' });
			}

			const purchaseOrderId = await db
				.insert(purchaseOrders)
				.values({
					poCode: 'PO-XY12',
					supplierId: cart.supplierId
				})
				.returning({ id: purchaseOrders.id })
				.then(([newOrder]) => newOrder.id);

			const cartItems =
				cart.items.map((items) => ({
					productId: items.productId,
					purchaseOrderId: purchaseOrderId,
					quantity: items.quantity
				})) ?? [];

			await db.insert(purchaseOrderItems).values(cartItems);

			await db.delete(purchaseOrderCarts).where(eq(purchaseOrderCarts.id, currentCart?.id ?? 0));

			event.cookies.delete('purchase_cart_session', { path: '/' });
		} catch (error) {
			console.error('Error creating purchase order:', error);
			return fail(500, { message: 'An unexpected error occurred' });
		}

		return { message: 'Purchase order created successfully' };
	},
	deletePurchaseOrderItem: async ({ request, cookies }) => {
		const formData = await request.formData();
		const purchaseOrderItemId = formData.get('purchaseOrderItemId');

		if (!purchaseOrderItemId) {
			return fail(400, { message: 'Purchase order item ID is required' });
		}
		try {
			const currentCart = getPurchaseOrder(cookies);

			const cartItems = await db.query.purchaseOrderCartItems.findMany({
				where: eq(purchaseOrderCartItems.cartId, currentCart?.id ?? 0)
			});

			await db
				.delete(purchaseOrderCartItems)
				.where(eq(purchaseOrderCartItems.id, Number(purchaseOrderItemId)));

			if (cartItems.length === 1) {
				cookies.delete('purchase_cart_session', { path: '/' });
			}
		} catch (error) {
			console.error('Error deleting purchase order item:', error);
			return fail(500, { message: 'An unexpected error occurred' });
		}

		return { message: 'Purchase order item deleted successfully' };
	}
};

const getPurchaseOrder = (cookies: Cookies) => {
	const orderCookie = cookies.get('purchase_cart_session');
	const existingOrder: PurchaseOrderItemCookie | undefined = orderCookie
		? JSON.parse(orderCookie)
		: undefined;

	return existingOrder;
};
