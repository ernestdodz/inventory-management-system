import { db } from '$lib/db';
import { inventoryItems } from '$lib/db/schema/inventory-schema';
import { purchaseOrders } from '$lib/db/schema/purchase-order-schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/sql';

export const load = async () => {
	const pendingPurchaseOrders = await db.query.purchaseOrders.findMany({
		where: eq(purchaseOrders.status, 'pending'),
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
	addInventory: async ({ url }) => {
		try {
			const purchaseOrder = await db.query.purchaseOrders.findFirst({
				where: eq(purchaseOrders.poCode, url.searchParams.get('poCode') ?? ''),
				with: {
					items: true
				}
			});

			if (!purchaseOrder) {
				error(404, 'Purchase order not found');
			}

			for (const item of purchaseOrder.items) {
				const existingItem = await db.query.inventoryItems.findFirst({
					where: eq(inventoryItems.productId, item.productId)
				});

				if (existingItem) {
					await db
						.update(inventoryItems)
						.set({
							stockIn: (existingItem.stockIn ?? 0) + item.quantity
						})
						.where(eq(inventoryItems.id, existingItem.id));
				} else {
					await db.insert(inventoryItems).values({
						productId: item.productId,
						stockIn: item.quantity,
						stockOut: 0
					});
				}
			}

			await db.delete(purchaseOrders).where(eq(purchaseOrders.id, purchaseOrder.id));

			console.log('Inventory added successfully');
		} catch (error) {
			console.error(error);
			return {
				message: 'Internal server error'
			};
		}
	}
};

// const getReceiveOrderCookie = (cookies: Cookies) => {
// 	const orderCookie = cookies.get('receive_order_session');
// 	const existingOrder: ReceiveOrderItemCookie | undefined = orderCookie
// 		? JSON.parse(orderCookie)
// 		: undefined;

// 	return existingOrder;
// };
