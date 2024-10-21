import { serial, text, pgTable } from 'drizzle-orm/pg-core';

export const customers = pgTable('customer', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	position: text('position', {
		enum: ['GUEST', 'REPRESENTATIVE', 'VENDOR', 'EMPLOYEE', 'OTHER']
	}).notNull()
});

export type Customer = typeof customers.$inferSelect;
