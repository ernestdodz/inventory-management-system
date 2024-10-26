import { db } from '$lib/db';

export const load = async () => {
	const inventory = await db.query.inventoryItems.findMany({
		with: {
			product: true
		}
	});
	return { inventory };
};
