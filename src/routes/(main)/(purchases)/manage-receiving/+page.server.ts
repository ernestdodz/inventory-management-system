import { db } from '$lib/db';

export const load = async () => {
	const purchaseOrders = await db.query.purchaseOrders.findMany({
		with: {
			items: {
				with: {
					product: true
				}
			},
			supplier: true
		}
	});
	return { purchaseOrders };
};

// export const actions = {
// 	createPurchaseOrder: async ({ request }) => {
// 		const formData = await request.formData();
// 	}
// };
