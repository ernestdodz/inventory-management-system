import { serial, text, boolean, pgTable, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { suppliers } from './supplier-schema';

export const products = pgTable('product', {
	id: serial('id').primaryKey(),
	sku: text('sku').notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => productCategories.id),
	price: integer('price').notNull(),
	supplierId: integer('supplier_id')
});

export type Product = typeof products.$inferSelect;

export const productCategories = pgTable('product_category', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	status: boolean('status').default(true).notNull()
});

export type ProductCategory = typeof productCategories.$inferSelect;

export const productRelations = relations(products, ({ one }) => ({
	category: one(productCategories, {
		fields: [products.categoryId],
		references: [productCategories.id]
	}),
	supplier: one(suppliers, {
		fields: [products.supplierId],
		references: [suppliers.id]
	})
}));
