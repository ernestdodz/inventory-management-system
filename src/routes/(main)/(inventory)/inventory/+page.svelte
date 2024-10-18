<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { Search } from 'lucide-svelte';

	// Fake data for demonstration
	const inventoryData = [
		{ sku: 'SKU001', name: 'Product A', stockIn: 100, stockOut: 30, stockAvailable: 70 },
		{ sku: 'SKU002', name: 'Product B', stockIn: 150, stockOut: 50, stockAvailable: 100 },
		{ sku: 'SKU003', name: 'Product C', stockIn: 80, stockOut: 20, stockAvailable: 60 },
		{ sku: 'SKU004', name: 'Product D', stockIn: 200, stockOut: 100, stockAvailable: 100 },
		{ sku: 'SKU005', name: 'Product E', stockIn: 120, stockOut: 40, stockAvailable: 80 }
	];

	let searchQuery = '';

	$: filteredInventory = inventoryData.filter(
		(item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.sku.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<div class="container mx-auto mt-12 px-4">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<div>
				<Card.Title class="text-3xl font-bold">Inventory Items</Card.Title>
				<Card.Description>Manage your product inventory</Card.Description>
			</div>
			<div class="relative">
				<Search
					class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
					size={20}
				/>
				<input
					type="text"
					placeholder="Search inventory..."
					bind:value={searchQuery}
					class="rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header class="border-b border-gray-100/50 bg-primary">
					<Table.Row>
						<Table.Head class="text-primary-foreground">SKU</Table.Head>
						<Table.Head class="text-primary-foreground">Product Name</Table.Head>
						<Table.Head class="text-primary-foreground">Stock In</Table.Head>
						<Table.Head class="text-primary-foreground">Stock Out</Table.Head>
						<Table.Head class="text-primary-foreground">Stock Available</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredInventory as item}
						<Table.Row>
							<Table.Cell>{item.sku}</Table.Cell>
							<Table.Cell>{item.name}</Table.Cell>
							<Table.Cell>{item.stockIn}</Table.Cell>
							<Table.Cell>{item.stockOut}</Table.Cell>
							<Table.Cell>{item.stockAvailable}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
