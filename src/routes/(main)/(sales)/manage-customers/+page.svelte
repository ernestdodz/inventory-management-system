<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte';
	import AddCustomerForm from '$lib/components/customers/AddCustomerForm.svelte';

	const { data } = $props();
</script>

<div class="container mx-auto mt-12 space-y-8">
	<div>
		<h1 class="text-3xl font-bold">Manage Customers</h1>
		<p class="mt-4 text-sm text-muted-foreground">
			Create, edit, and manage your customer information
		</p>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<Card class="lg:col-span-1">
			<CardHeader>
				<CardTitle>Add New Customer</CardTitle>
			</CardHeader>
			<CardContent>
				<AddCustomerForm data={data.form} />
			</CardContent>
		</Card>

		<Card class="lg:col-span-2">
			<CardHeader>
				<div class="flex justify-between">
					<CardTitle class="mb-2">Customer List</CardTitle>
					<span class="mt-2 text-sm text-muted-foreground">
						Total: {data.customers.length}
					</span>
				</div>
				<div class="space-x flex w-[400px] items-center gap-2">
					<div class="relative flex flex-grow items-center">
						<Search
							class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input type="text" placeholder="Search customers..." class="pl-8" />
					</div>

					<Button variant="outline" size="sm">Export</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head>Position</Table.Head>
							<Table.Head class="text-right">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.customers as customer}
							<Table.Row>
								<Table.Cell class="font-medium">{customer.name}</Table.Cell>
								<Table.Cell>{customer.position}</Table.Cell>
								<Table.Cell class="text-right">
									<Button variant="outline" size="sm" class="mr-2">Edit</Button>
									<Button variant="destructive" size="sm">Delete</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</CardContent>
		</Card>
	</div>
</div>
