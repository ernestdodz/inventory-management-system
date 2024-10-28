<script lang="ts">
	import AddCategoryForm from '$lib/components/categories/AddCategoryForm.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { MoreHorizontal, Search } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import DeleteCategoryForm from '$lib/components/categories/DeleteCategoryForm.svelte';
	import type { ProductCategory } from '$lib/db/schema';
	const { data } = $props();

	let deleteOpen = $state(false);
	let selectedCategory = $state<ProductCategory | null>(null);
</script>

<div class="container mx-auto space-y-8">
	<div>
		<h1 class="text-2xl font-bold">Manage Product Categories</h1>
		<p class="mt-4 text-sm text-muted-foreground">
			Create, edit, and manage your product categories
		</p>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<Card class="lg:col-span-1">
			<CardHeader>
				<CardTitle>Add New Category</CardTitle>
			</CardHeader>
			<CardContent>
				<AddCategoryForm data={data.form} />
			</CardContent>
		</Card>

		<Card class="lg:col-span-2">
			<CardHeader>
				<div class="flex justify-between">
					<CardTitle class="mb-2">Category List</CardTitle>
					<span class="mt-2 text-sm text-muted-foreground">
						Total: {data.categories.length}
					</span>
				</div>
				<div class="space-x flex w-[400px] items-center gap-2">
					<div class="relative flex flex-grow items-center">
						<Search
							class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input type="text" placeholder="Search categories..." class=" pl-8" />
					</div>

					<Button variant="outline" size="sm" onclick={() => (deleteOpen = false)}>Export</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head class="text-right">Action</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.categories as category}
							<Table.Row>
								<Table.Cell class="font-medium">
									{category.name}
								</Table.Cell>
								<Table.Cell>
									<div class="flex items-center space-x-2">
										<Checkbox checked={category.status} disabled />
										<span>{category.status ? 'Active' : 'Inactive'}</span>
									</div>
								</Table.Cell>
								<Table.Cell class="text-right">
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											<MoreHorizontal class="mr-4 h-4 w-4" />
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Group>
												<DropdownMenu.Item
													onclick={() => {
														selectedCategory = category;
														deleteOpen = true;
													}}
												>
													Delete
												</DropdownMenu.Item>
											</DropdownMenu.Group>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</CardContent>
		</Card>
	</div>
</div>

{#if selectedCategory}
	<DeleteCategoryForm
		isOpen={deleteOpen}
		category={selectedCategory}
		onClose={() => {
			deleteOpen = false;
			selectedCategory = null;
		}}
	/>
{/if}
