import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { products } from './product-schema';
import { relations } from 'drizzle-orm';

export const inventoryItems = pgTable('inventory_items', {
	id: serial('id').primaryKey(),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id, {
			onDelete: 'cascade'
		}),
	stockIn: integer('stock_in').default(0),
	stockOut: integer('stock_out').default(0)
});

export const inventoryItemRelations = relations(inventoryItems, ({ one }) => ({
	product: one(products, {
		fields: [inventoryItems.productId],
		references: [products.id]
	})
}));
