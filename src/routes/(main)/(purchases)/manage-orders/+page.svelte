<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import AddPurchaseOrderForm from '$lib/components/orders/AddPurchaseOrderForm.svelte';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Trash2 } from 'lucide-svelte'; // Import the Trash2 icon

	const { data } = $props();

	let purchaseOrderItems = [
		{ name: 'Powdered Milk', sku: '11762969', qty: 2, price: 30, amount: 60.0 },
		{ name: 'Chips (big)', sku: '11762968', qty: 3, price: 15, amount: 45.0 },
		{ name: 'Soda', sku: '11762970', qty: 4, price: 10, amount: 40.0 }
	];

	function calculateTotal() {
		return purchaseOrderItems.reduce((total, item) => total + item.amount, 0).toFixed(2);
	}
</script>

<div class="container mx-auto mt-4 space-y-6">
	<h1 class="mb-4 text-2xl font-bold">New Purchase Order</h1>

	<AddPurchaseOrderForm data={data.addForm} suppliers={data.suppliers} products={data.products} />

	<!-- Purchase Order Items Card -->
	<Card>
		<CardHeader>
			<CardTitle>Purchase Order Items</CardTitle>
		</CardHeader>
		<CardContent>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Product</Table.Head>
						<Table.Head class="text-right">Qty</Table.Head>
						<Table.Head class="text-right">Price</Table.Head>
						<Table.Head class="text-right">Amount</Table.Head>
						<Table.Head class="text-right">Supplier</Table.Head>
						<Table.Head></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.purchaseOrders as item}
						<Table.Row>
							<Table.Cell>
								<div>{item.product?.name ?? ''}</div>
								<div class="text-sm text-gray-500">{item.product?.sku ?? ''}</div>
							</Table.Cell>
							<Table.Cell class="text-right">{item.quantity}</Table.Cell>
							<Table.Cell class="text-right"
								>${item.product?.price.toFixed(2) ?? '0.00'}
							</Table.Cell>
							<Table.Cell class="text-right"
								>${(item.product!.price * item.quantity).toFixed(2)}
							</Table.Cell>
							<Table.Cell class="text-right">
								<div>{item.supplier?.name ?? ''}</div>
								<div class="text-sm text-gray-500">{item.supplier?.address ?? ''}</div>
							</Table.Cell>
							<Table.Cell>
								<Button variant="destructive" size="icon" class="h-8 w-8" on:click={() => {}}>
									<Trash2 class="h-4 w-4" />
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
				<div class="text-xl font-bold">Total: ${calculateTotal()}</div>
				<div class="space-x-2">
					<Button class="w-32">Create PO</Button>
				</div>
			</div>
		</CardFooter>
	</Card>
</div>
