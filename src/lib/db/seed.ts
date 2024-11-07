import { createAuthClient } from 'better-auth/svelte';
import { db } from '$lib/db';
import { productCategories, products, customers, suppliers } from '$lib/db/schema';

export const authClient = createAuthClient({
	baseURL: 'http://localhost:5173'
});

async function seed() {
	try {
		// Seed users
		const user = await authClient.signUp.email({
			name: 'Demo User',
			email: 'demo@demo.com',
			password: 'password123'
		});

		if (!user || !user.data) {
			process.exit(1);
		}

		// Seed product categories
		const [category1, category2] = await db
			.insert(productCategories)
			.values([
				{ name: 'Electronics', status: true },
				{ name: 'Furniture', status: true }
			])
			.returning();

		// Seed products
		await db.insert(products).values([
			{
				sku: 'ELEC-001',
				name: 'Laptop',
				description: 'High-performance laptop',
				categoryId: category1.id,
				price: 999,
				userId: user.data.user.id
			},
			{
				sku: 'FURN-001',
				name: 'Office Chair',
				description: 'Ergonomic office chair',
				categoryId: category2.id,
				price: 199,
				userId: user.data.user.id
			}
		]);

		// Seed customers
		await db.insert(customers).values([
			{
				name: 'John Doe',
				position: 'REPRESENTATIVE'
			},
			{
				name: 'Jane Smith',
				position: 'VENDOR'
			}
		]);

		// Seed suppliers
		await db.insert(suppliers).values([
			{
				name: 'Tech Supplies Inc',
				address: '123 Tech Street',
				phone: '555-0123',
				email: 'tech@supplies.com'
			},
			{
				name: 'Furniture Wholesale',
				address: '456 Furniture Ave',
				phone: '555-0456',
				email: 'sales@furniture.com'
			}
		]);

		console.log('✅ Seed data inserted successfully');
		process.exit(0);
	} catch (error) {
		console.error('❌ Error seeding data:', error);
		process.exit(1);
	}
}

seed();
