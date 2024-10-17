import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { productSchema } from '$lib/validation';
import { db } from '$lib/db';
import { products } from '$lib/db/schema/product-schema.js';

export const load: PageServerLoad = async () => {
	const products = await db.query.products.findMany({
		with: {
			category: true,
			supplier: true
		}
	});

	const categories = await db.query.productCategories.findMany();
	const suppliers = await db.query.suppliers.findMany();
	return {
		products,
		categories,
		suppliers,
		form: await superValidate(zod(productSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(productSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		await db.insert(products).values(form.data);
		return { success: true, form };
	}
};
