<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import AddSupplierForm from '$lib/components/suppliers/AddSupplierForm.svelte';
	import EditSupplierForm from '$lib/components/suppliers/EditSupplierForm.svelte';
	import DeleteSupplierModal from '$lib/components/suppliers/DeleteSupplierModal.svelte';
	import type { Supplier } from '$lib/db/schema';
	import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-svelte';

	const { data } = $props();

	let selectedSuppliers = $state<Supplier[]>([]);
	let isTableHovered = $state(false);
	let currentPage = $state(1);
	let totalPages = $state(Math.ceil(data.suppliers.length / 10));

	function toggleSupplierSelection(supplier: Supplier, checked: boolean) {
		selectedSuppliers = checked
			? (selectedSuppliers.push(supplier), selectedSuppliers)
			: selectedSuppliers.filter((s) => s.id !== supplier.id);
	}

	function prevPage() {
		if (currentPage > 1) currentPage--;
	}

	function nextPage() {
		if (currentPage < totalPages) currentPage++;
	}
</script>

<div class="container mx-auto">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold">Supplier List ({data.suppliers.length})</h1>
				<p class="text-sm text-muted-foreground">
					Manage suppliers (Server side table functionalities.)
				</p>
			</div>
			<div class="flex items-center gap-2">
				{#if selectedSuppliers.length > 0}
					<DeleteSupplierModal {selectedSuppliers} onSelect={() => (selectedSuppliers = [])} />
				{/if}
				<AddSupplierForm data={data.addForm} />
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
							<Table.Head>Name</Table.Head>
							<Table.Head>Email</Table.Head>
							<Table.Head>Address</Table.Head>
							<Table.Head>Phone</Table.Head>
							<Table.Head>Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.suppliers as supplier}
							<Table.Row>
								<Table.Cell>
									{#if isTableHovered}
										<Checkbox
											checked={selectedSuppliers.includes(supplier)}
											onCheckedChange={(checked) =>
												toggleSupplierSelection(supplier, checked as boolean)}
										/>
									{/if}
								</Table.Cell>
								<Table.Cell>{supplier.name}</Table.Cell>
								<Table.Cell>{supplier.email}</Table.Cell>
								<Table.Cell>{supplier.address}</Table.Cell>
								<Table.Cell>{supplier.phone}</Table.Cell>
								<Table.Cell>
									<!-- <EditSupplierForm {supplier} data={data.editForm} /> -->
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
			Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, data.suppliers.length)}
			of {data.suppliers.length} entries
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
