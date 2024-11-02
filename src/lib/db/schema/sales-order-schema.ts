import { serial, pgTable, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { customers } from './customer-schema';
import { inventoryItems } from './inventory-schema';
import { relations } from 'drizzle-orm/relations';

export const salesOrderStatusEnum = pgEnum('sales_order_status', [
	'pending',
	'approved',
	'rejected',
	'completed'
]);

export const salesOrderCarts = pgTable('sales_order_cart', {
	id: serial('id').primaryKey(),
	customerId: integer('customer_id')
		.notNull()
		.references(() => customers.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const salesOrderCartItems = pgTable('sales_order_cart_item', {
	id: serial('id').primaryKey(),
	cartId: integer('cart_id')
		.notNull()
		.references(() => salesOrderCarts.id, {
			onDelete: 'cascade'
		}),
	inventoryItemId: integer('inventory_item_id')
		.notNull()
		.references(() => inventoryItems.id, {
			onDelete: 'cascade'
		}),
	quantity: integer('quantity').notNull(),
	sellingPrice: integer('selling_price').notNull()
});

export const salesOrderCartItemsRelations = relations(salesOrderCartItems, ({ one }) => ({
	cart: one(salesOrderCarts, {
		fields: [salesOrderCartItems.cartId],
		references: [salesOrderCarts.id]
	}),
	inventoryItem: one(inventoryItems, {
		fields: [salesOrderCartItems.inventoryItemId],
		references: [inventoryItems.id]
	})
}));

export const salesOrderCartRelations = relations(salesOrderCarts, ({ many }) => ({
	items: many(salesOrderCartItems)
}));

export type SalesOrderCartItem = typeof salesOrderCartItems.$inferSelect;
// export const salesOrders = pgTable('sales_order', {
// 	id: serial('id').primaryKey(),
// 	customerId: integer('customer_id')
// 		.notNull()
// 		.references(() => customers.id),
// 	orderDate: timestamp('order_date').notNull().defaultNow(),
// 	soCode: varchar('so_code', { length: 20 }).notNull(),
// 	status: salesOrderStatusEnum('status').notNull().default('pending')
// });

// export const salesOrderItems = pgTable('sales_order_item', {
// 	id: serial('id').primaryKey(),
// 	salesOrderId: integer('sales_order_id')
// 		.notNull()
// 		.references(() => salesOrders.id),
// 	productId: integer('product_id')
// 		.notNull()
// 		.references(() => products.id),
// 	quantity: integer('quantity').notNull(),
// 	sellingPrice: integer('selling_price').notNull()
// });
