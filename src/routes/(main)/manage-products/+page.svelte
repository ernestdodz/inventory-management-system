<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import AddProductForm from '$lib/components/AddProductForm.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';

	const { data } = $props();

	let selectedProducts = $state<string[]>([]);
	let isTableHovered = $state(false);

	function handleDelete() {
		console.log('Deleting:', selectedProducts);
		selectedProducts = [];
	}

	function toggleProductSelection(sku: string, checked: boolean) {
		if (checked) {
			selectedProducts.push(sku);
		} else {
			selectedProducts = selectedProducts.filter((s) => s !== sku);
		}
	}
</script>

<div class="container mx-auto mt-4">
	<div class="my-2 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Product List</h1>
		<AddProductForm data={data.form} categories={data.categories} suppliers={data.suppliers} />
	</div>

	{#if selectedProducts.length > 0}
		<Button variant="destructive" size="sm" class="mb-2" on:click={handleDelete}>
			Delete Selected ({selectedProducts.length})
		</Button>
	{/if}

	<div
		role="table"
		onmouseenter={() => (isTableHovered = true)}
		onmouseleave={() => (isTableHovered = false)}
	>
		<Table.Root>
			<Table.Caption>A list of all products.</Table.Caption>
			<Table.Header>
				<Table.Row>
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
						<Table.Cell>
							{#if isTableHovered}
								<Checkbox
									checked={selectedProducts.includes(product.sku)}
									onCheckedChange={(checked) =>
										toggleProductSelection(product.sku, checked as boolean)}
								/>
							{/if}
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
</div>
