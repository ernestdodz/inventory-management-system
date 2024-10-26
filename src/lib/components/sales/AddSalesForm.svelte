<script lang="ts">
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { customerSchema, type CustomerSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Loader2, Plus } from 'lucide-svelte';

	// let { data } = $props<{ data: SuperValidated<CustomerSchema> }>();

	// const form = superForm(data, {
	// 	validators: zodClient(customerSchema),
	// 	onUpdated: ({ form: f }) => {
	// 		if (f.valid) {
	// 			toast.success(`Customer added successfully`);
	// 		}
	// 	}
	// });

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

	// const { form: formData, enhance, submitting, errors } = form;
</script>

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

	<Button on:click={() => []} class="w-32">Add to Sale</Button>
</div>
