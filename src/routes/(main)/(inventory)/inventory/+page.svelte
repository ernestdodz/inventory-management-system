<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
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

<div class="container mx-auto mt-12">
	<div
		class="flex flex-col space-y-4 pb-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
	>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Inventory Items</h1>
			<p class="text-muted-foreground">Manage your product inventory</p>
		</div>
		<div class="relative">
			<Search
				class="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
				size={20}
			/>
			<Input
				type="search"
				placeholder="Search inventory..."
				bind:value={searchQuery}
				class="w-[250px] pl-10 sm:w-[300px]"
			/>
		</div>
	</div>

	<Card.Root>
		<Card.Content>
			<Table.Root class="overflow-hidden rounded-lg">
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
