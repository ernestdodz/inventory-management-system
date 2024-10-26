import { z } from 'zod';

export const productSchema = z.object({
	id: z.number().int().optional(),
	sku: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	categoryId: z.number().int().positive(),
	price: z.number().min(0)
});

export type ProductSchema = z.infer<typeof productSchema>;

export const categorySchema = z.object({
	id: z.number().int().optional(),
	name: z.string().min(1),
	status: z.boolean().default(true)
});

export type CategorySchema = z.infer<typeof categorySchema>;

export const supplierSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().min(1),
	address: z.string().min(1),
	phone: z.string().min(1),
	email: z.string().email()
});

export type SupplierSchema = z.infer<typeof supplierSchema>;

export const customerSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().min(1),
	position: z.enum(['GUEST', 'REPRESENTATIVE', 'VENDOR', 'EMPLOYEE', 'OTHER']).default('GUEST')
});

export type CustomerSchema = z.infer<typeof customerSchema>;

export const purchaseOrderSchema = z.object({
	poCode: z.string().min(1),
	supplierId: z.number().int().positive(),
	status: z.enum(['pending', 'approved', 'rejected'])
});

export type PurchaseOrderSchema = z.infer<typeof purchaseOrderSchema>;

export const purchaseOrderItemSchema = z.object({
	supplierId: z.number().int().positive(),
	productId: z.number().int().positive(),
	quantity: z.number().int().positive().default(1)
});

export type PurchaseOrderItemSchema = z.infer<typeof purchaseOrderItemSchema>;
interface IPurchaseOrderItemCookie {
	id: number;
	supplierId: number;
}

export type PurchaseOrderItemCookie = IPurchaseOrderItemCookie | undefined;

export const purchaseOrderCartSchema = z.object({
	supplierId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date()
});

export const purchaseOrderCartItemSchema = z.object({
	supplierId: z.number(),
	productId: z.number(),
	quantity: z.number()
});

export type PurchaseOrderCartItemSchema = z.infer<typeof purchaseOrderCartItemSchema>;

export const salesOrderCartItemSchema = z.object({
	customerId: z.number().int().positive(),
	productId: z.number().int().positive(),
	quantity: z.number().int().positive(),
	sellingPrice: z.number().default(0)
});

export type SalesOrderCartItemSchema = z.infer<typeof salesOrderCartItemSchema>;

export const inventoryItemSchema = z.object({
	productId: z.number().int().positive(),
	stockIn: z.number().int().positive(),
	stockOut: z.number().int().positive()
});

export type InventoryItemSchema = z.infer<typeof inventoryItemSchema>;
