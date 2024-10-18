<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import AddProductForm from '$lib/components/products/AddProductForm.svelte';
	import EditProductForm from '$lib/components/products/EditProductForm.svelte';
	import DeleteProductModal from '$lib/components/products/DeleteProductModal.svelte';
	import type { Product } from '$lib/db/schema';

	const { data } = $props();

	let selectedProducts = $state<Product[]>([]);
	let isTableHovered = $state(false);

	function toggleProductSelection(product: Product, checked: boolean) {
		selectedProducts = checked
			? (selectedProducts.push(product), selectedProducts)
			: selectedProducts.filter((s) => s.id !== product.id);
	}
</script>

<div class="container mx-auto mt-4">
	<div class="my-2 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Product List</h1>
		<div class="flex items-center gap-2">
			{console.log(selectedProducts)}
			{#if selectedProducts.length > 0}
				<DeleteProductModal {selectedProducts} onSelect={() => (selectedProducts = [])} />
			{/if}
			<div class="flex-shrink-0">
				<AddProductForm
					data={data.addForm}
					categories={data.categories}
					suppliers={data.suppliers}
				/>
			</div>
		</div>
	</div>

	<div role="table" onmouseenter={() => (isTableHovered = true)}>
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
									checked={selectedProducts.includes(product)}
									onCheckedChange={(checked) => toggleProductSelection(product, checked as boolean)}
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
							<!-- <Button variant="default" size="sm">Edit</Button> -->
							<EditProductForm
								{product}
								data={data.editForm}
								categories={data.categories}
								suppliers={data.suppliers}
							/>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
