<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import AddProductForm from '$lib/components/AddProductForm.svelte';
	const { data } = $props();
</script>

<div class="container mx-auto mt-4">
	<div class="my-2 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Product List</h1>
		<AddProductForm data={data.form} categories={data.categories} suppliers={data.suppliers} />
	</div>

	<Table.Root>
		<Table.Caption>A list of all products.</Table.Caption>
		<Table.Header>
			<Table.Row>
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
					<Table.Cell>{product.sku}</Table.Cell>
					<Table.Cell>{product.name}</Table.Cell>
					<Table.Cell>{product.description}</Table.Cell>
					<Table.Cell>{product.category}</Table.Cell>
					<Table.Cell>${product.price.toFixed(2)}</Table.Cell>
					<Table.Cell>{product.supplier}</Table.Cell>
					<Table.Cell>
						<Button variant="outline" size="sm" class="mr-2">Edit</Button>
						<Button variant="destructive" size="sm">Delete</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
