<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import AddInventoryForm from '$lib/components/inventory/AddInventoryForm.svelte';
	import type { PurchaseOrder, PurchaseOrderItem } from '$lib/db/schema/purchase-order-schema';

	let { data } = $props();

	let selectedPO = $state({
		label: '',
		value: 0
	});

	let selectedPurchaseOrder = $state<PurchaseOrder | null>(null);
	let receivingItems = $state<PurchaseOrderItem[]>([]);

	function loadPurchaseOrder(poId: number) {
		const po = data.purchaseOrders.find((po) => po.id === poId);
		if (po) {
			selectedPurchaseOrder = po;
			receivingItems = po.items ?? [];
			selectedPO = {
				label: po.poCode,
				value: po.id
			};
		} else {
			selectedPurchaseOrder = null;
			receivingItems = [];
		}
	}

	$effect(() => {
		if (data.purchaseOrders.length > 0) {
			loadPurchaseOrder(data.purchaseOrders[0].id);
		} else {
			selectedPurchaseOrder = null;
			receivingItems = [];
			selectedPO = { label: '', value: 0 };
		}
	});
</script>

<div class="container mx-auto space-y-6">
	<h1 class="mb-4 text-2xl font-bold">Manage Receiving</h1>

	<Card>
		<CardHeader>
			<CardTitle>Select Purchase Order</CardTitle>
			<CardDescription>Choose a purchase order to process receiving.</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="flex items-end space-x-2">
				<div class="flex-grow">
					<Label for="po-select" class="mb-2 block">Purchase Order</Label>
					<Select.Root
						selected={selectedPO}
						onSelectedChange={(v) => {
							if (v && v.label) {
								selectedPO = { label: v.label, value: v.value };
							}
						}}
					>
						<Select.Trigger id="po-select" class="w-full">
							<Select.Value placeholder="Select purchase order" />
						</Select.Trigger>
						<Select.Content>
							{#each data.purchaseOrders as po}
								<Select.Item value={po.id} label={po.poCode} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<Button on:click={() => loadPurchaseOrder(selectedPO.value)}>Load PO</Button>
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle data-sveltekit-reload>Receiving Items</CardTitle>
				{#if selectedPurchaseOrder}
					<div class="text-sm text-gray-500">SUPPLIER: {selectedPurchaseOrder.supplier.name}</div>
				{:else}
					<div class="text-sm text-gray-500">No purchase order selected</div>
				{/if}
			</div>
		</CardHeader>
		<CardContent>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Product</Table.Head>
						<Table.Head>Qty</Table.Head>
						<Table.Head>Price</Table.Head>
						<Table.Head>Amount</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if receivingItems.length > 0}
						{#each receivingItems as item}
							<Table.Row>
								<Table.Cell>
									<div>{item.product.name}</div>
									<div class="text-sm text-gray-500">{item.product.sku}</div>
								</Table.Cell>
								<Table.Cell>{item.quantity}</Table.Cell>
								<Table.Cell>{item.product.price}</Table.Cell>
								<Table.Cell>{item.product.price * item.quantity}</Table.Cell>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={4} class="text-center text-gray-500">
								No items to display. Please select and load a purchase order.
							</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</CardContent>
	</Card>

	<div class="mt-4 flex justify-end px-4">
		<AddInventoryForm loadedPoCode={selectedPurchaseOrder?.poCode ?? ''} />
	</div>
</div>
