<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	// Fake data for demonstration
	const inventoryData = [
		{ sku: 'SKU001', name: 'Product A', stockIn: 100, stockOut: 30, stockAvailable: 70 },
		{ sku: 'SKU002', name: 'Product B', stockIn: 150, stockOut: 50, stockAvailable: 100 },
		{ sku: 'SKU003', name: 'Product C', stockIn: 80, stockOut: 20, stockAvailable: 60 },
		{ sku: 'SKU004', name: 'Product D', stockIn: 200, stockOut: 100, stockAvailable: 100 },
		{ sku: 'SKU005', name: 'Product E', stockIn: 120, stockOut: 40, stockAvailable: 80 }
	];
</script>

<div class="container mx-auto mt-4">
	<div class="my-2">
		<h1 class="text-2xl font-bold">Inventory</h1>
	</div>

	<div role="table">
		<Table.Root>
			<Table.Caption>Current inventory status of all products.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>SKU</Table.Head>
					<Table.Head>Product Name</Table.Head>
					<Table.Head>Stock In</Table.Head>
					<Table.Head>Stock Out</Table.Head>
					<Table.Head>Stock Available</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each inventoryData as item}
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
	</div>
</div>
