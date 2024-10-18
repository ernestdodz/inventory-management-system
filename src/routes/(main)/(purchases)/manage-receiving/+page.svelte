<script lang="ts">
	// Import necessary components and functions
	import { onMount } from 'svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';

	// Updated dummy data with price
	let receivedItems = [
		{
			id: 1,
			productName: 'Item 1',
			quantity: 10,
			price: 19.99,
			receivedDate: '2023-04-15',
			supplier: 'Supplier A'
		},
		{
			id: 2,
			productName: 'Item 2',
			quantity: 5,
			price: 24.99,
			receivedDate: '2023-04-16',
			supplier: 'Supplier B'
		},
		{
			id: 3,
			productName: 'Item 3',
			quantity: 15,
			price: 14.99,
			receivedDate: '2023-04-17',
			supplier: 'Supplier C'
		}
	];

	let selectedItems = $state<(typeof receivedItems)[0][]>([]);
	let isTableHovered = $state(false);

	function toggleItemSelection(item: (typeof receivedItems)[0], checked: boolean) {
		selectedItems = checked
			? (selectedItems.push(item), selectedItems)
			: selectedItems.filter((s) => s.id !== item.id);
	}

	onMount(async () => {
		// Fetch received items data here
		// receivedItems = await fetchReceivedItems();
	});
</script>

<div class="container mx-auto mt-4">
	<div class="my-2 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Manage Receiving</h1>
		<div class="flex items-center gap-2">
			{#if selectedItems.length > 0}
				<!-- Add DeleteReceivedItemModal component here -->
				<button class="rounded bg-red-500 px-2 py-1 text-white">Delete Selected</button>
			{/if}
			<div class="flex-shrink-0">
				<!-- Add AddReceivedItemForm component here -->
				<button class="rounded bg-green-500 px-2 py-1 text-white">Add Received Item</button>
			</div>
		</div>
	</div>

	<div role="table" onmouseenter={() => (isTableHovered = true)}>
		<Table.Root>
			<Table.Caption>A list of all received items.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[50px]" />
					<Table.Head>ID</Table.Head>
					<Table.Head>Product Name</Table.Head>
					<Table.Head>Quantity</Table.Head>
					<Table.Head>Price</Table.Head>
					<Table.Head>Received Date</Table.Head>
					<Table.Head>Supplier</Table.Head>
					<Table.Head>Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each receivedItems as item}
					<Table.Row>
						<Table.Cell>
							{#if isTableHovered}
								<Checkbox
									checked={selectedItems.includes(item)}
									onCheckedChange={(checked) => toggleItemSelection(item, checked as boolean)}
								/>
							{/if}
						</Table.Cell>
						<Table.Cell>{item.id}</Table.Cell>
						<Table.Cell>{item.productName}</Table.Cell>
						<Table.Cell>{item.quantity}</Table.Cell>
						<Table.Cell>${item.price.toFixed(2)}</Table.Cell>
						<Table.Cell>{item.receivedDate}</Table.Cell>
						<Table.Cell>{item.supplier}</Table.Cell>
						<Table.Cell>
							<!-- Add EditReceivedItemForm component here -->
							<button class="mr-2 rounded bg-blue-500 px-2 py-1 text-white">Edit</button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
