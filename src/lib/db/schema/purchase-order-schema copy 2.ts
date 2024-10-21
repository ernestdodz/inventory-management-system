import { serial, pgTable, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { suppliers } from './supplier-schema';
import { products } from './product-schema';

export const purchaseOrders = pgTable('purchase_order', {
	id: serial('id').primaryKey(),
	supplierId: integer('supplier_id').references(() => suppliers.id),
	productId: integer('product_id').references(() => products.id),
	quantity: integer('quantity').notNull()
});

export const purchaseOrderRelations = relations(purchaseOrders, ({ one }) => ({
	supplier: one(suppliers, {
		fields: [purchaseOrders.supplierId],
		references: [suppliers.id]
	}),
	product: one(products, { fields: [purchaseOrders.productId], references: [products.id] })
}));

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
