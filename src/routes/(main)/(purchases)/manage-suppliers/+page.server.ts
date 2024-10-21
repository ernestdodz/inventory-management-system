import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { supplierSchema } from '$lib/validation';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db';
import type { PageServerLoad, Actions } from './$types';
import { suppliers } from '$lib/db/schema/supplier-schema';

export const load: PageServerLoad = async () => {
	return {
		suppliers: await db.select().from(suppliers),
		addForm: await superValidate(zod(supplierSchema)),
		editForm: await superValidate(zod(supplierSchema))
	};
};

export const actions: Actions = {
	addSupplier: async (event) => {
		const form = await superValidate(event, zod(supplierSchema));
		if (!form.valid) {
			console.error('Add Supplier Form Validation Failed:', form.errors);
			return fail(400, { form });
		}
		const session = await event.locals.getSession();

		if (!session?.user) {
			return fail(401, { form, message: 'Unauthorized' });
		}

		try {
			await db.insert(suppliers).values(form.data);
			console.log('New Supplier Added:');
			return { success: true, form };
		} catch (error) {
			console.error('Error adding supplier:', error);
			return fail(500, { form, message: 'Failed to add supplier' });
		}
	},
	editSupplier: async (event) => {
		const form = await superValidate(event, zod(supplierSchema));
		if (!form.valid) {
			console.error('Edit Supplier Form Validation Failed:', form.errors);
			return fail(400, { form });
		}

		const session = await event.locals.getSession();

		if (!session?.user) {
			return fail(401, { form, message: 'Unauthorized' });
		}

		try {
			const result = await db
				.update(suppliers)
				.set(form.data)
				.where(eq(suppliers.id, Number(form.data.id)))
				.returning();

			console.log('Supplier Updated:', result[0]);
			return { success: true, form };
		} catch (error) {
			console.error('Error updating supplier:', error);
			return fail(500, { form, message: 'Failed to update supplier' });
		}
	},

	deleteSuppliers: async ({ request }) => {
		const formData = await request.formData();
		const supplierIds = formData.getAll('supplierIds') as string[];

		for (const id of supplierIds) {
			await db.delete(suppliers).where(eq(suppliers.id, Number(id)));
			// console.log('Deleted Product:', deletedProduct);
		}

		return { success: true };
	}
};
