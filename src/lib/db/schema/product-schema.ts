import { serial, text, boolean, pgTable, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { user } from './auth-schema';

export const products = pgTable('product', {
	id: serial('id').primaryKey(),
	sku: text('sku').notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => productCategories.id, {
			onDelete: 'cascade'
		}),
	price: integer('price').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export type Product = typeof products.$inferSelect;

export const productCategories = pgTable('product_category', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	status: boolean('status').default(true).notNull()
});

export type ProductCategory = typeof productCategories.$inferSelect;

export const productRelations = relations(products, ({ one }) => ({
	user: one(user, {
		fields: [products.userId],
		references: [user.id]
	}),
	category: one(productCategories, {
		fields: [products.categoryId],
		references: [productCategories.id]
	})
}));
