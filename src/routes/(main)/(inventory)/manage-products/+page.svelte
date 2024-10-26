<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import AddProductForm from '$lib/components/products/AddProductForm.svelte';
	import EditProductForm from '$lib/components/products/EditProductForm.svelte';
	import DeleteProductModal from '$lib/components/products/DeleteProductModal.svelte';
	import type { Product } from '$lib/db/schema';
	import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-svelte';

	const { data } = $props();

	let selectedProducts = $state<Product[]>([]);
	let isTableHovered = $state(false);
	let currentPage = $state(1);
	let totalPages = $state(Math.ceil(data.products.length / 10));

	function toggleProductSelection(product: Product, checked: boolean) {
		selectedProducts = checked
			? (selectedProducts.push(product), selectedProducts)
			: selectedProducts.filter((s) => s.id !== product.id);
	}

	function prevPage() {
		if (currentPage > 1) currentPage--;
	}

	function nextPage() {
		if (currentPage < totalPages) currentPage++;
	}
</script>

<div class="container mx-auto mt-12">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold">Product List ({data.products.length})</h1>
				<p class="text-sm text-muted-foreground">
					Manage products (Server side table functionalities.)
				</p>
			</div>
			<div class="flex items-center gap-2">
				{#if selectedProducts.length > 0}
					<DeleteProductModal {selectedProducts} onSelect={() => (selectedProducts = [])} />
				{/if}
				<AddProductForm data={data.addForm} categories={data.categories} />
			</div>
		</div>
	</div>

	<Card>
		<CardContent>
			<div class="flex items-center gap-4">
				<div class="relative w-64">
					<Input type="text" placeholder="Search name..." class="pl-8" />
					<Search class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
				</div>
				<Button variant="outline" class="flex items-center gap-2">
					<Filter class="h-4 w-4" />
					Gender
				</Button>
				<Button variant="outline">Country</Button>
				<Button variant="outline">Company</Button>
			</div>

			<div role="table" onmouseenter={() => (isTableHovered = true)}>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[50px]" />
							<Table.Head>SKU</Table.Head>
							<Table.Head>Name</Table.Head>
							<Table.Head>Description</Table.Head>
							<Table.Head>Category</Table.Head>
							<Table.Head>Price</Table.Head>
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
											onCheckedChange={(checked) =>
												toggleProductSelection(product, checked as boolean)}
										/>
									{/if}
								</Table.Cell>
								<Table.Cell>{product.sku}</Table.Cell>
								<Table.Cell>{product.name}</Table.Cell>
								<Table.Cell>{product.description}</Table.Cell>
								<Table.Cell>{product.category.name}</Table.Cell>
								<Table.Cell>${product.price.toFixed(2)}</Table.Cell>

								<Table.Cell>
									<EditProductForm {product} data={data.editForm} categories={data.categories} />
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</CardContent>
	</Card>

	<div class="mt-4 flex items-center justify-between">
		<div>
			Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, data.products.length)}
			of {data.products.length} entries
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" on:click={prevPage} disabled={currentPage === 1}>
				<ChevronLeft class="h-4 w-4" />
			</Button>
			<span>Page {currentPage} of {totalPages}</span>
			<Button variant="outline" on:click={nextPage} disabled={currentPage === totalPages}>
				<ChevronRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
