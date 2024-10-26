import { serial, pgTable, integer, timestamp, pgEnum, varchar } from 'drizzle-orm/pg-core';
import { customers } from './customer-schema';
import { products } from './product-schema';

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
	cartId: integer('cart_id').references(() => salesOrderCarts.id, {
		onDelete: 'cascade'
	})
});

export const salesOrderStatusEnum = pgEnum('sales_order_status', [
	'pending',
	'approved',
	'rejected',
	'completed'
]);

export const salesOrders = pgTable('sales_order', {
	id: serial('id').primaryKey(),
	customerId: integer('customer_id')
		.notNull()
		.references(() => customers.id),
	orderDate: timestamp('order_date').notNull().defaultNow(),
	soCode: varchar('so_code', { length: 20 }).notNull(),
	status: salesOrderStatusEnum('status').notNull().default('pending')
});

export const salesOrderItems = pgTable('sales_order_item', {
	id: serial('id').primaryKey(),
	salesOrderId: integer('sales_order_id')
		.notNull()
		.references(() => salesOrders.id),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id),
	quantity: integer('quantity').notNull(),
	sellingPrice: integer('selling_price').notNull()
});
