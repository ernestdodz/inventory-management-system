<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import DeleteSalesItemForm from '$lib/components/sales/DeleteSalesForm.svelte';

	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import AddSalesForm from '$lib/components/sales/AddSalesForm.svelte';
	import CreateSalesForm from '$lib/components/sales/CreateSalesForm.svelte';

	const { data } = $props();
</script>

<div class="container mx-auto space-y-6">
	<h1 class="mb-4 text-2xl font-bold">Sales Order</h1>

	<Card>
		<CardHeader>
			<CardTitle>Sales Details</CardTitle>
			<CardDescription
				>Add a customer and product to start adding items to your sales order.</CardDescription
			>
		</CardHeader>
		<CardContent>
			<AddSalesForm
				data={data.addForm}
				customers={data.customers}
				inventoryItems={data.inventoryItems}
				existingOrder={data.existingOrder}
			/>
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
						<Table.Head>Qty</Table.Head>
						<Table.Head>Selling Price</Table.Head>
						<Table.Head>Amount</Table.Head>
						<Table.Head></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.salesOrdersItems as item}
						<Table.Row>
							<Table.Cell>
								<div>{item.inventoryItem.product.name}</div>
								<div class="text-sm text-gray-500">{item.inventoryItem.product.sku}</div>
							</Table.Cell>
							<Table.Cell>{item.quantity}</Table.Cell>
							<Table.Cell>${item.sellingPrice.toFixed(2)}</Table.Cell>
							<Table.Cell>${(item.sellingPrice * item.quantity).toFixed(2)}</Table.Cell>
							<Table.Cell>
								<DeleteSalesItemForm salesOrderItem={item} />
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
				<CreateSalesForm />
			</div>
		</CardFooter>
	</Card>
</div>
