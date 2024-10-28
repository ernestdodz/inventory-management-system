import { serial, pgTable, integer, timestamp, pgEnum, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { suppliers } from './supplier-schema';
import { products } from './product-schema';

export const purchaseOrderStatusEnum = pgEnum('purchase_order_status', [
	'pending',
	'approved',
	'rejected',
	'completed'
]);

export const purchaseOrderCarts = pgTable('purchase_order_cart', {
	id: serial('id').primaryKey(),
	supplierId: integer('supplier_id')
		.notNull()
		.references(() => suppliers.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const purchaseOrderCartItems = pgTable('purchase_order_cart_item', {
	id: serial('id').primaryKey(),
	cartId: integer('cart_id').references(() => purchaseOrderCarts.id, {
		onDelete: 'cascade'
	}),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id, {
			onDelete: 'cascade'
		}),
	quantity: integer('quantity').notNull()
});

export const purchaseOrders = pgTable('purchase_order', {
	id: serial('id').primaryKey(),
	supplierId: integer('supplier_id')
		.notNull()
		.references(() => suppliers.id),
	orderDate: timestamp('order_date').notNull().defaultNow(),
	poCode: varchar('po_code', { length: 20 }).notNull(),
	status: purchaseOrderStatusEnum('status').notNull().default('pending')
});

export const purchaseOrderItems = pgTable('purchase_order_item', {
	id: serial('id').primaryKey(),
	purchaseOrderId: integer('purchase_order_id')
		.notNull()
		.references(() => purchaseOrders.id, {
			onDelete: 'cascade'
		}),
	productId: integer('product_id')
		.notNull()
		.references(() => products.id),
	quantity: integer('quantity').notNull()
});

export const purchaseOrderCartRelations = relations(purchaseOrderCarts, ({ one, many }) => ({
	supplier: one(suppliers, {
		fields: [purchaseOrderCarts.supplierId],
		references: [suppliers.id]
	}),
	items: many(purchaseOrderCartItems)
}));

export const purchaseOrderCartItemRelations = relations(purchaseOrderCartItems, ({ one }) => ({
	cart: one(purchaseOrderCarts, {
		fields: [purchaseOrderCartItems.cartId],
		references: [purchaseOrderCarts.id]
	}),
	product: one(products, {
		fields: [purchaseOrderCartItems.productId],
		references: [products.id]
	})
}));

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

// Types
export type PurchaseOrderCart = typeof purchaseOrderCarts.$inferSelect;
export type PurchaseOrderCartItem = typeof purchaseOrderCartItems.$inferSelect;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect & {
	supplier: typeof suppliers.$inferSelect;
	items: (typeof purchaseOrderItems.$inferSelect & {
		product: typeof products.$inferSelect;
	})[];
};
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect & {
	product: typeof products.$inferSelect;
};
