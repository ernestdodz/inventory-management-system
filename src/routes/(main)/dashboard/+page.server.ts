import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import { products, inventoryItems, purchaseOrderItems, salesOrderCartItems } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const LOW_STOCK_THRESHOLD = 50;

	const inventories = await db.select().from(inventoryItems);

	const totalLowStockItems = inventories.filter(
		(item) => (item.stockIn ?? 0) <= LOW_STOCK_THRESHOLD
	).length;

	const addedProducts = await db.select().from(products);

	const pendingPurchaseOrders = await db.select().from(purchaseOrderItems);

	const pendingSalesOrders = await db.select().from(salesOrderCartItems);

	const totalProducts = addedProducts.length;
	const totalInventories = inventories.length;
	const totalPendingPurchaseOrders = pendingPurchaseOrders.length;
	const totalPendingSalesOrders = pendingSalesOrders.length;

	const recentActivities = await db.query.inventoryItems.findMany({
		orderBy: desc(inventoryItems.updatedAt),
		with: {
			user: true,
			product: true
		},
		limit: 5
	});

	return {
		totalProducts,
		totalInventories,
		totalPendingPurchaseOrders,
		totalPendingSalesOrders,
		totalLowStockItems,
		recentActivities
	};
};
