import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { categorySchema } from '$lib/validation';
import { db } from '$lib/db';
import { productCategories } from '$lib/db/schema/product-schema';
import { eq } from 'drizzle-orm/sql';

export const load = async () => {
	const categories = await db.query.productCategories.findMany();
	return {
		categories,
		form: await superValidate(zod(categorySchema))
	};
};

export const actions: Actions = {
	addCategory: async (event) => {
		const form = await superValidate(event, zod(categorySchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await db.insert(productCategories).values(form.data);
		return { form };
	},
	editCategory: async (event) => {
		const form = await superValidate(event, zod(categorySchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		if (!form.data.id) {
			return fail(400, { form, message: 'Category ID is required' });
		}

		await db.update(productCategories).set(form.data).where(eq(productCategories.id, form.data.id));

		return { form };
	},
	deleteCategory: async (event) => {
		const form = await superValidate(event, zod(categorySchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		if (!form.data.id) {
			return fail(400, { form, message: 'Category ID is required' });
		}

		await db.delete(productCategories).where(eq(productCategories.id, form.data.id));
		return { form };
	}
};
