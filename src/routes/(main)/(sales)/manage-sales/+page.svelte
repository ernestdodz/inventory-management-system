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

	let customers = ['Claire Blake', 'John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Brown'];
	let products = [
		'Chips (big) | 11762968',
		'Powdered Milk | 11762969',
		'Soda | 11762970',
		'Bread | 11762971',
		'Eggs (dozen) | 11762972'
	];

	let selectedCustomer = $state({
		label: '',
		value: ''
	});
	let selectedProduct = $state({
		label: '',
		value: ''
	});
	let quantity = $state(1);

	let orderItems = [
		{ name: 'Powdered Milk', sku: '11762969', qty: 2, price: 30, amount: 60.0 },
		{ name: 'Chips (big)', sku: '11762968', qty: 3, price: 15, amount: 45.0 },
		{ name: 'Soda', sku: '11762970', qty: 4, price: 10, amount: 40.0 }
	];

	function calculateTotal() {
		return orderItems.reduce((total, item) => total + item.amount, 0).toFixed(2);
	}
</script>

<div class="container mx-auto mt-4 space-y-6">
	<h1 class="mb-4 text-2xl font-bold">New Order</h1>

	<Card>
		<CardHeader>
			<CardTitle>Order Details</CardTitle>
			<CardDescription
				>Add a customer and product to start adding items to your order.</CardDescription
			>
		</CardHeader>
		<CardContent>
			<div class="flex items-end space-x-2">
				<div class="flex-grow">
					<Label for="customer-select" class="mb-2 block">Customer</Label>
					<Select.Root
						selected={selectedCustomer}
						onSelectedChange={(v) => {
							if (v) {
								selectedCustomer = {
									label: v.label ?? '',
									value: v.value
								};
							}
						}}
					>
						<Select.Trigger id="customer-select" class="w-full">
							<Select.Value placeholder="Select customer" />
						</Select.Trigger>
						<Select.Content>
							{#each customers as customer}
								<Select.Item value={customer} label={customer} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="flex-grow">
					<Label for="product-select" class="mb-2 block">Product</Label>
					<Select.Root
						selected={selectedProduct}
						onSelectedChange={(v) => {
							if (v) {
								selectedProduct = {
									label: v.label ?? '',
									value: v.value
								};
							}
						}}
					>
						<Select.Trigger id="product-select" class="w-full">
							<Select.Value placeholder="Select product" />
						</Select.Trigger>
						<Select.Content>
							{#each products as product}
								<Select.Item value={product} label={product} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="w-20">
					<Label for="quantity" class="mb-2 block">Qty</Label>
					<Input type="number" id="quantity" bind:value={quantity} min="1" placeholder="Qty" />
				</div>

				<Button on:click={() => []} class="w-32">Add to Order</Button>
			</div>
		</CardContent>
	</Card>

	<!-- Order Items Card -->
	<Card>
		<CardHeader>
			<CardTitle>Order Items</CardTitle>
		</CardHeader>
		<CardContent>
			<!-- Order items list -->
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
					{#each orderItems as item, index}
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
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="h-4 w-4"
									>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
									</svg>
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
				<Button class="w-32">Create Order</Button>
			</div>
		</CardFooter>
	</Card>
</div>
