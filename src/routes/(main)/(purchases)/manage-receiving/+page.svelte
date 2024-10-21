<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';

	// Fake data for purchase orders and products
	let purchaseOrders = ['PO-001', 'PO-002', 'PO-003', 'PO-004', 'PO-005'];

	let selectedPO = $state({
		label: '',
		value: ''
	});

	let receivingItems = [
		{ name: 'Powdered Milk', sku: '11762969', orderedQty: 10, receivedQty: 0, remainingQty: 10 },
		{ name: 'Chips (big)', sku: '11762968', orderedQty: 15, receivedQty: 5, remainingQty: 10 },
		{ name: 'Soda', sku: '11762970', orderedQty: 20, receivedQty: 0, remainingQty: 20 }
	];
</script>

<div class="container mx-auto mt-4 space-y-6">
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
							if (v) {
								selectedPO = {
									label: v.label ?? '',
									value: v.value
								};
							}
						}}
					>
						<Select.Trigger id="po-select" class="w-full">
							<Select.Value placeholder="Select purchase order" />
						</Select.Trigger>
						<Select.Content>
							{#each purchaseOrders as po}
								<Select.Item value={po} label={po} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<Button on:click={() => []} class="w-32">Load PO</Button>
			</div>
		</CardContent>
	</Card>

	<!-- Receiving Items Card -->
	<Card>
		<CardHeader>
			<CardTitle>Receiving Items</CardTitle>
		</CardHeader>
		<CardContent>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Product</Table.Head>
						<Table.Head class="text-right">Ordered Qty</Table.Head>
						<Table.Head class="text-right">Received Qty</Table.Head>
						<Table.Head class="text-right">Remaining Qty</Table.Head>
						<Table.Head>Action</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each receivingItems as item, index}
						<Table.Row>
							<Table.Cell>
								<div>{item.name}</div>
								<div class="text-sm text-gray-500">{item.sku}</div>
							</Table.Cell>
							<Table.Cell class="text-right">{item.orderedQty}</Table.Cell>
							<Table.Cell class="text-right">
								<Input
									type="number"
									value={item.receivedQty}
									min="0"
									max={item.orderedQty}
									class="w-20 text-right"
								/>
							</Table.Cell>
							<Table.Cell class="text-right">{item.remainingQty}</Table.Cell>
							<Table.Cell>
								<Button variant="outline" size="sm" on:click={() => {}}>Receive</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</CardContent>
		<CardFooter class="flex justify-end">
			<Button class="w-32">Complete Receiving</Button>
		</CardFooter>
	</Card>
</div>
