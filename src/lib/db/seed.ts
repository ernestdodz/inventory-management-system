import { db } from '$lib/db';
import { productCategories, products, customers, suppliers } from '$lib/db/schema';

const USER_ID = 'dEz53MziksVmwla69ZVam';

async function seed() {
	try {
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
				userId: USER_ID
			},
			{
				sku: 'FURN-001',
				name: 'Office Chair',
				description: 'Ergonomic office chair',
				categoryId: category2.id,
				price: 199,
				userId: USER_ID
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
