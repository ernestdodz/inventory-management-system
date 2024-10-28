<script lang="ts">
	import AddCategoryForm from '$lib/components/categories/AddCategoryForm.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { MoreHorizontal, Search } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	const { data } = $props();

	let editingId = $state<number | null>(null);
	let isEditing = $derived((categoryId: number) => editingId === categoryId);
	let editForm = $state<{ name: string; status: boolean }>({ name: '', status: false });
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

					<Button variant="outline" size="sm">Export</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head class="text-right">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.categories as category}
							<Table.Row>
								<Table.Cell class="font-medium">
									{#if isEditing(category.id)}
										<Input
											type="text"
											bind:value={editForm.name}
											class="h-8 border-none bg-muted/50 px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
										/>
									{:else}
										{category.name}
									{/if}
								</Table.Cell>
								<Table.Cell>
									<div class="flex items-center space-x-2">
										<Checkbox
											checked={isEditing(category.id) ? editForm.status : category.status}
											disabled={!isEditing(category.id)}
										/>
										<span>
											{isEditing(category.id)
												? editForm.status
													? 'Active'
													: 'Inactive'
												: category.status
													? 'Active'
													: 'Inactive'}
										</span>
									</div>
								</Table.Cell>
								<Table.Cell class="text-right">
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											<MoreHorizontal class="mr-4 h-4 w-4" />
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Group>
												{#if isEditing(category.id)}
													<DropdownMenu.Item onclick={() => (editingId = null)}
														>Save</DropdownMenu.Item
													>
												{:else}
													<DropdownMenu.Item
														onclick={() => {
															editingId = category.id;
															editForm = { name: category.name, status: category.status };
														}}>Edit</DropdownMenu.Item
													>
													<DropdownMenu.Item>Delete</DropdownMenu.Item>
												{/if}
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
