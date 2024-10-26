<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Trash2 } from 'lucide-svelte';

	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import AddSalesForm from '$lib/components/sales/AddSalesForm.svelte';

	// function calculateTotal() {
	// 	return orderItems.reduce((total, item) => total + item.amount, 0).toFixed(2);
	// }

	const { data } = $props();
</script>

<div class="container mx-auto mt-4 space-y-6">
	<h1 class="mb-4 text-2xl font-bold">Sales Order</h1>

	<Card>
		<CardHeader>
			<CardTitle>Sales Details</CardTitle>
			<CardDescription
				>Add a customer and product to start adding items to your sales order.</CardDescription
			>
		</CardHeader>
		<CardContent>
			<AddSalesForm />
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Sales Items</CardTitle>
		</CardHeader>
		<CardContent>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Product</Table.Head>
						<Table.Head class="text-right">Qty</Table.Head>
						<Table.Head class="text-right">Price</Table.Head>
						<Table.Head class="text-right">Amount</Table.Head>
						<Table.Head></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.salesOrders as item, index}
						<Table.Row>
							<Table.Cell>
								<div>{item.name}</div>
								<div class="text-sm text-gray-500">{item.sku}</div>
							</Table.Cell>
							<Table.Cell class="text-right">{item.qty}</Table.Cell>
							<Table.Cell class="text-right">${item.price.toFixed(2)}</Table.Cell>
							<Table.Cell class="text-right">${item.amount.toFixed(2)}</Table.Cell>
							<Table.Cell>
								<Button variant="destructive" size="icon" class="h-8 w-8" on:click={() => {}}>
									<Trash2 />
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</CardContent>
		<CardFooter class="flex flex-col">
			<hr class="my-4 w-full border-t border-gray-200" />
			<div class="flex w-full items-center justify-between">
				<div class="text-xl font-bold">Total: $149</div>
				<Button class="w-32">Create Order</Button>
			</div>
		</CardFooter>
	</Card>
</div>
