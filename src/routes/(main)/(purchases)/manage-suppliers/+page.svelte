<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	// Fake data for suppliers
	let suppliers = [
		{
			id: 1,
			name: 'Tech Solutions Inc.',
			address: '123 Tech St, City',
			phone: '123-456-7890',
			email: 'contact@techsolutions.com'
		},
		{
			id: 2,
			name: 'Global Gadgets',
			address: '456 Gadget Ave, Town',
			phone: '987-654-3210',
			email: 'info@globalgadgets.com'
		},
		{
			id: 3,
			name: 'Supply Masters',
			address: '789 Supply Rd, Village',
			phone: '456-789-0123',
			email: 'hello@supplymasters.com'
		}
	];

	// Form data
	let newSupplier = { name: '', address: '', phone: '', email: '' };

	function handleSubmit() {
		if (newSupplier.name && newSupplier.address) {
			suppliers = [...suppliers, { id: suppliers.length + 1, ...newSupplier }];
			newSupplier = { name: '', address: '', phone: '', email: '' };
		}
	}
</script>

<div class="container mx-auto mt-4">
	<h1 class="mb-6 text-2xl font-bold">Manage Suppliers</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Left column: Supplier creation form -->
		<div class="space-y-4">
			<h2 class="text-xl font-semibold">Add New Supplier</h2>
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="supplier-name">Supplier Name</Label>
					<Input id="supplier-name" bind:value={newSupplier.name} required />
				</div>

				<div class="space-y-2">
					<Label for="supplier-address">Address</Label>
					<Input id="supplier-address" bind:value={newSupplier.address} required />
				</div>

				<div class="space-y-2">
					<Label for="supplier-phone">Phone</Label>
					<Input id="supplier-phone" bind:value={newSupplier.phone} />
				</div>

				<div class="space-y-2">
					<Label for="supplier-email">Email</Label>
					<Input id="supplier-email" bind:value={newSupplier.email} type="email" />
				</div>

				<Button type="submit">Add Supplier</Button>
			</form>
		</div>

		<!-- Right column: Suppliers list -->
		<div>
			<h2 class="mb-4 text-xl font-semibold">Suppliers List</h2>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Address</Table.Head>
						<Table.Head>Phone</Table.Head>
						<Table.Head>Email</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each suppliers as supplier}
						<Table.Row>
							<Table.Cell>{supplier.name}</Table.Cell>
							<Table.Cell>{supplier.address}</Table.Cell>
							<Table.Cell>{supplier.phone}</Table.Cell>
							<Table.Cell>{supplier.email}</Table.Cell>
							<Table.Cell>
								<Button variant="outline" size="sm">Edit</Button>
								<Button variant="outline" size="sm">Delete</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>
</div>
