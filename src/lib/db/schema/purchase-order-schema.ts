import { serial, pgTable, integer, timestamp, pgEnum, boolean, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { suppliers } from './supplier-schema';
import { products } from './product-schema';

export const purchaseOrderStatusEnum = pgEnum('purchase_order_status', [
	'draft',
	'pending',
	'approved',
	'rejected',
	'completed'
]);

export const purchaseOrders = pgTable('purchase_order', {
	id: serial('id').primaryKey(),
	supplierId: integer('supplier_id')
		.notNull()
		.references(() => suppliers.id),
	orderDate: timestamp('order_date'),
	poCode: varchar('po_code', { length: 20 }),
	status: purchaseOrderStatusEnum('status').notNull().default('draft')
});

export const purchaseOrderItems = pgTable('purchase_order_item', {
	id: serial('id').primaryKey(),
	purchaseOrderId: integer('purchase_order_id').references(() => purchaseOrders.id, {
		onDelete: 'cascade'
	}),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id),
	quantity: integer('quantity').notNull(),
	isCart: boolean('is_cart').notNull().default(true) //will be needed to check will use is cart and get the purchase order id, actually might not be needed can be used the status draft
});

export const purchaseOrderRelations = relations(purchaseOrders, ({ one, many }) => ({
	supplier: one(suppliers, {
		fields: [purchaseOrders.supplierId],
		references: [suppliers.id]
	}),
	items: many(purchaseOrderItems)
}));

export const purchaseOrderItemRelations = relations(purchaseOrderItems, ({ one }) => ({
	purchaseOrder: one(purchaseOrders, {
		fields: [purchaseOrderItems.purchaseOrderId],
		references: [purchaseOrders.id]
	}),
	product: one(products, {
		fields: [purchaseOrderItems.productId],
		references: [products.id]
	})
}));

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
