<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	// Fake data for customers and products
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

<div class="container mx-auto mt-4 rounded-lg bg-white p-6 shadow">
	<h1 class="mb-6 text-2xl font-bold">New Order</h1>

	<div class="space-y-6">
		<!-- Customer selection -->
		<div class="w-1/3">
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

		<!-- Product selection, Quantity, and Add button -->
		<div class="flex space-x-4">
			<div class="w-1/2">
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

			<div class="w-1/6">
				<Label for="quantity" class="mb-2 block">Qty</Label>
				<Input type="number" id="quantity" bind:value={quantity} min="1" class="w-full" />
			</div>

			<div class="flex w-1/3 items-end">
				<Button on:click={() => []} class="w-full">Add to Order</Button>
			</div>
		</div>

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

		<!-- Order summary -->
		<div class="flex items-center justify-between">
			<div class="text-xl font-bold">Total: ${calculateTotal()}</div>
			<Button class="w-32">Create Order</Button>
		</div>
	</div>
</div>
