import { z } from 'zod';

export const productSchema = z.object({
	sku: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	categoryId: z.number().int().positive(),
	price: z.number().min(0),
	supplierId: z.number().int().positive()
});

export type ProductSchema = z.infer<typeof productSchema>;
