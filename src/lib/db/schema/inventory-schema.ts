import { integer, pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';
import { products } from './product-schema';
import { relations } from 'drizzle-orm';
import type { Product } from './product-schema';
import { user } from './auth-schema';

export const inventoryItems = pgTable('inventory_items', {
	id: serial('id').primaryKey(),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id, {
			onDelete: 'cascade'
		}),
	stockIn: integer('stock_in').default(0),
	stockOut: integer('stock_out').default(0),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const inventoryItemRelations = relations(inventoryItems, ({ one }) => ({
	user: one(user, {
		fields: [inventoryItems.userId],
		references: [user.id]
	}),
	product: one(products, {
		fields: [inventoryItems.productId],
		references: [products.id]
	})
}));

export type InventoryItem = typeof inventoryItems.$inferSelect & {
	product: Product;
};
