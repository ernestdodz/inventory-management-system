<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	// Fake data for categories
	let categories = [
		{ id: 1, name: 'Electronics', status: true },
		{ id: 2, name: 'Clothing', status: true },
		{ id: 3, name: 'Books', status: false },
		{ id: 4, name: 'Home & Garden', status: true }
	];

	// Form data
	let newCategory = { name: '', status: true };

	function handleSubmit() {
		if (newCategory.name) {
			categories = [...categories, { id: categories.length + 1, ...newCategory }];
			newCategory = { name: '', status: true };
		}
	}
</script>

<div class="container mx-auto mt-4">
	<h1 class="mb-6 text-2xl font-bold">Manage Product Categories</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Left column: Category creation form -->
		<div class="space-y-4">
			<h2 class="text-xl font-semibold">Create New Category</h2>
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="category-name">Category Name</Label>
					<Input id="category-name" bind:value={newCategory.name} />
				</div>

				<div class="flex items-center space-x-2">
					<Checkbox id="category-status" bind:checked={newCategory.status} />
					<Label for="category-status">Active</Label>
				</div>

				<Button type="submit">Create Category</Button>
			</form>
		</div>

		<!-- Right column: Categories list -->
		<div>
			<h2 class="mb-4 text-xl font-semibold">Categories List</h2>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each categories as category}
						<Table.Row>
							<Table.Cell>{category.name}</Table.Cell>
							<Table.Cell>
								<Checkbox checked={category.status} disabled />
							</Table.Cell>
							<Table.Cell>
								<Button variant="outline" size="sm">Edit</Button>
								<Button variant="outline" size="sm">Delete</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>
</div>
