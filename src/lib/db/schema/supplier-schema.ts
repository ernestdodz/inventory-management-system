import { serial, text, pgTable } from 'drizzle-orm/pg-core';

export const suppliers = pgTable('supplier', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	address: text('address').notNull(),
	phone: text('phone'),
	email: text('email')
});

export type Supplier = typeof suppliers.$inferSelect;
