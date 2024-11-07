import { db } from '$lib/db';
import { inventoryItems, products } from '$lib/db/schema';
import { or, ilike, inArray } from 'drizzle-orm';

export const load = async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';

	const inventory = await db.query.inventoryItems.findMany({
		where: searchQuery
			? inArray(
					inventoryItems.productId,
					db
						.select({ id: products.id })
						.from(products)
						.where(
							or(ilike(products.name, `%${searchQuery}%`), ilike(products.sku, `%${searchQuery}%`))
						)
				)
			: undefined,
		with: {
			product: true
		}
	});

	return { inventory, search: searchQuery };
};
