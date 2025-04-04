<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte';
	import { Package } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	const { data } = $props();

	let searchQuery = $state(data.search);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (searchQuery) {
			params.set('search', searchQuery);
		} else {
			params.delete('search');
		}
		goto(`?${params.toString()}`, { replaceState: true });
	}
</script>

<div class="container mx-auto">
	<div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Inventory Items</h1>
			<p class="text-muted-foreground">Manage your product inventory</p>
		</div>
		<div class="relative">
			<form onsubmit={handleSubmit}>
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
			</form>
		</div>
	</div>
	<hr class="my-4 border-t border-gray-200" />

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
			{#each data.inventory as item}
				<Table.Row>
					<Table.Cell>{item.product.sku}</Table.Cell>
					<Table.Cell>{item.product.name}</Table.Cell>
					<Table.Cell>{item.stockIn}</Table.Cell>
					<Table.Cell>{item.stockOut}</Table.Cell>
					<Table.Cell>{(item.stockIn ?? 0) - (item.stockOut ?? 0)}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={5}>
						<div class="flex flex-col items-center justify-center py-10 text-center">
							<div class="rounded-full bg-muted p-3">
								<Package class="h-10 w-10 text-muted-foreground" />
							</div>
							<h3 class="mt-4 text-lg font-semibold">No inventory items found</h3>
							<p class="mb-4 mt-2 text-sm text-muted-foreground">
								Get started by purchasing products and receiving purchase orders.
							</p>
							<div class="flex gap-2">
								<Button variant="outline" href="/manage-orders">Purchase Products</Button>
								<Button href="/manage-receiving">Receive Orders</Button>
							</div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
