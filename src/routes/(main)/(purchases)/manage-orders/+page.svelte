<script lang="ts">
	import AddPurchaseOrderForm from '$lib/components/orders/AddPurchaseOrderForm.svelte';

	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Trash2 } from 'lucide-svelte';

	import CreatePurchaseOrderForm from '$lib/components/orders/CreatePurchaseOrderForm.svelte';

	const { data } = $props();
</script>

<div class="container mx-auto space-y-6">
	<h1 class="mb-4 text-2xl font-bold">New Purchase Order</h1>

	<AddPurchaseOrderForm
		data={data.addForm}
		suppliers={data.suppliers}
		products={data.products}
		existingOrder={data.existingOrder}
	/>

	<Card>
		<CardHeader>
			<CardTitle>Purchase Order Items</CardTitle>
		</CardHeader>
		<CardContent>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Product</Table.Head>
						<Table.Head>Qty</Table.Head>
						<Table.Head>Price</Table.Head>
						<Table.Head>Amount</Table.Head>
						<Table.Head>Action</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.purchaseOrderItems as item}
						<Table.Row>
							<Table.Cell>
								<div class="truncate text-sm">{item.product?.name ?? ''}</div>
								<div class="truncate text-xs text-gray-500">{item.product?.sku ?? ''}</div>
							</Table.Cell>
							<Table.Cell>{item.quantity}</Table.Cell>
							<Table.Cell>${item.product?.price.toFixed(2) ?? '0.00'}</Table.Cell>
							<Table.Cell>${(item.product!.price * item.quantity).toFixed(2)}</Table.Cell>
							<Table.Cell>
								<Button variant="destructive" size="icon" class="h-8 w-8" onclick={() => {}}>
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
				<div class="text-xl font-bold">
					Total: ${data.purchaseOrderItems
						.reduce((acc, item) => acc + item.product!.price * item.quantity, 0)
						.toFixed(2)}
				</div>
				<div class="space-x-2">
					<CreatePurchaseOrderForm />
				</div>
			</div>
		</CardFooter>
	</Card>
</div>
