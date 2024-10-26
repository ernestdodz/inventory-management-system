import { db } from '$lib/db';
// import { purchaseOrders } from '$lib/db/schema';
import { inventoryItems } from '$lib/db/schema/inventory-schema';

import { purchaseOrders } from '$lib/db/schema/purchase-order-schema';

import { eq } from 'drizzle-orm/sql';

export const load = async () => {
	//

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
		const purchaseOrder = await db.query.purchaseOrders.findFirst({
			where: eq(purchaseOrders.poCode, url.searchParams.get('poCode') ?? ''),
			with: {
				items: {
					with: {
						product: true
					}
				}
			}
		});

		const mappedItems =
			purchaseOrder?.items.map((item) => ({
				productId: item.productId,
				stockIn: item.quantity,
				stockOut: 0
			})) ?? [];

		await db.insert(inventoryItems).values(mappedItems);

		await db.delete(purchaseOrders).where(eq(purchaseOrders.id, purchaseOrder?.id ?? 0));
	}
};

// const getReceiveOrderCookie = (cookies: Cookies) => {
// 	const orderCookie = cookies.get('receive_order_session');
// 	const existingOrder: ReceiveOrderItemCookie | undefined = orderCookie
// 		? JSON.parse(orderCookie)
// 		: undefined;

// 	return existingOrder;
// };
