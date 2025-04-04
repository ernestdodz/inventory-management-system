import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { productSchema } from '$lib/validation';
import { db } from '$lib/db';
import { eq, or, ilike } from 'drizzle-orm';
import { products } from '$lib/db/schema/product-schema.js';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';

	const productList = await db.query.products.findMany({
		where: searchQuery
			? or(ilike(products.name, `%${searchQuery}%`), ilike(products.sku, `%${searchQuery}%`))
			: undefined,
		orderBy: (products, { desc }) => [desc(products.id)],
		with: {
			category: true
		}
	});

	return {
		products: productList,
		categories: await db.query.productCategories.findMany(),
		addForm: await superValidate(zod(productSchema)),
		editForm: await superValidate(zod(productSchema)),
		search: searchQuery
	};
};

export const actions: Actions = {
	addProduct: async (event) => {
		const form = await superValidate(event, zod(productSchema));
		if (!form.valid) {
			console.error('Add Product Form Validation Failed:', form.errors);
			return fail(400, { form });
		}
		const session = await event.locals.getSession();

		if (!session?.user) {
			return fail(401, { form, message: 'Unauthorized' });
		}

		try {
			await db.insert(products).values({ ...form.data, userId: session?.user.id });
			return { success: true, form };
		} catch (error) {
			console.error('Error adding product:', error);
			return fail(500, { form, message: 'Failed to add product' });
		}
	},
	editProduct: async (event) => {
		const form = await superValidate(event, zod(productSchema));
		if (!form.valid) {
			console.error('Edit Product Form Validation Failed:', form.errors);
			return fail(400, { form });
		}

		const session = await event.locals.getSession();

		if (!session?.user) {
			return fail(401, { form, message: 'Unauthorized' });
		}

		try {
			const result = await db
				.update(products)
				.set({ ...form.data, userId: session?.user.id })
				.where(eq(products.id, Number(form.data.id)))
				.returning();

			console.log('Product Updated:', result[0]);
			return { success: true, form };
		} catch (error) {
			console.error('Error updating product:', error);
			return fail(500, { form, message: 'Failed to update product' });
		}
	},

	deleteProducts: async ({ request }) => {
		const formData = await request.formData();
		const productIds = formData.getAll('productIds') as string[];

		for (const id of productIds) {
			await db.delete(products).where(eq(products.id, Number(id)));
		}

		return { success: true };
	}
};
