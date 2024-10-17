<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import AddProductForm from '$lib/components/AddProductForm.svelte';
	const { data } = $props();
	// Add these lines
	import { Checkbox } from '$lib/components/ui/checkbox';
	let selectedProducts: string[] = [];

	function handleDelete() {
		// Implement delete logic here
		console.log('Deleting:', selectedProducts);
		// Reset selection after delete
		selectedProducts = [];
	}
</script>

<div class="container mx-auto mt-4">
	<div class="my-2 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Product List</h1>
		<AddProductForm data={data.form} categories={data.categories} suppliers={data.suppliers} />
	</div>

	<!-- Add this button -->
	<Button
		variant="destructive"
		size="sm"
		class="mb-2"
		on:click={handleDelete}
		disabled={selectedProducts.length === 0}
	>
		Delete Selected
	</Button>

	<Table.Root>
		<Table.Caption>A list of all products.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<!-- Add this header for the checkbox column -->
				<Table.Head class="w-[50px]" />
				<Table.Head>SKU</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Head>Category</Table.Head>
				<Table.Head>Price</Table.Head>
				<Table.Head>Supplier</Table.Head>
				<Table.Head>Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.products as product}
				<Table.Row>
					<!-- Add this cell with a checkbox -->
					<Table.Cell>
						<Checkbox
							checked={selectedProducts.includes(product.sku)}
							onCheckedChange={(checked) => {
								if (checked) {
									selectedProducts = [...selectedProducts, product.sku];
								} else {
									selectedProducts = selectedProducts.filter((sku) => sku !== product.sku);
								}
							}}
						/>
					</Table.Cell>
					<Table.Cell>{product.sku}</Table.Cell>
					<Table.Cell>{product.name}</Table.Cell>
					<Table.Cell>{product.description}</Table.Cell>
					<Table.Cell>{product.category.name}</Table.Cell>
					<Table.Cell>${product.price.toFixed(2)}</Table.Cell>
					<Table.Cell>{product.supplier?.name ?? 'N/A'}</Table.Cell>
					<Table.Cell>
						<Button variant="default" size="sm">Edit</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
