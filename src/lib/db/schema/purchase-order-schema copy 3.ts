import { serial, pgTable, integer, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { suppliers } from './supplier-schema';
import { products } from './product-schema';

export const purchaseOrders = pgTable('purchase_order', {
	id: serial('id').primaryKey(),
	supplierId: integer('supplier_id').references(() => suppliers.id),
	orderDate: timestamp('order_date').notNull().defaultNow(),
	status: varchar('status', { length: 20 }).notNull().default('pending'),
	sessionId: varchar('session_id', { length: 255 })
});

export const purchaseOrderItems = pgTable('purchase_order_item', {
	id: serial('id').primaryKey(),
	purchaseOrderId: integer('purchase_order_id').references(() => purchaseOrders.id),
	productId: integer('product_id').references(() => products.id),
	quantity: integer('quantity').notNull()
});

export const purchaseOrderRelations = relations(purchaseOrders, ({ one, many }) => ({
	supplier: one(suppliers, {
		fields: [purchaseOrders.supplierId],
		references: [suppliers.id]
	}),
	items: many(purchaseOrderItems)
}));

export const purchaseOrderItemRelations = relations(purchaseOrderItems, ({ one }) => ({
	product: one(products, {
		fields: [purchaseOrderItems.productId],
		references: [products.id]
	})
}));

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
