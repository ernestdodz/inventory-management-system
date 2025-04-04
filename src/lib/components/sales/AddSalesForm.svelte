<script lang="ts">
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { salesOrderCartItemSchema, type SalesOrderCartItemSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Loader2 } from 'lucide-svelte';
	import type { Customer } from '$lib/db/schema/customer-schema';
	import type { SalesCartOrderItemCookie } from '$lib/types';
	import type { InventoryItem } from '$lib/db/schema/inventory-schema';
	import { goto } from '$app/navigation';
	import { Plus } from 'lucide-svelte';

	interface Props {
		data: SuperValidated<SalesOrderCartItemSchema>;
		customers: Customer[];
		inventoryItems: InventoryItem[];
		existingOrder: SalesCartOrderItemCookie;
	}
	let { data, customers, inventoryItems, existingOrder }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(salesOrderCartItemSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Item added successfully`);

				selectedInventoryItem = { label: '', value: 0 };
				selectedCustomer = { label: '', value: existingOrder?.customerId ?? 0 };
				// $formData.customerId = existingOrder?.customerId ?? 0;
			} else {
				console.log('invalid');
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	//things like this better not be handled client side and customer
	// should have all the object in the cookies.
	let selectedCustomer = $state({
		label: existingOrder ? customers.find((c) => c.id === existingOrder.customerId)?.name : '',
		value: existingOrder?.customerId ?? 0
	});
	let selectedInventoryItem = $state({
		label: '',
		value: 0
	});

	let stockAvailable = $state<number | undefined>(undefined);

	$effect(() => {
		$formData.customerId = selectedCustomer.value;
	});
</script>

<form method="POST" action="?/addSalesItem" class="space-y-8" use:enhance>
	<div class="min-h-[80px] w-96">
		<Form.Field {form} name="customerId">
			<Form.Control let:attrs>
				<Form.Label>Customer</Form.Label>
				<Select.Root
					selected={selectedCustomer}
					onSelectedChange={(v) => {
						if (v) {
							if (v.value === 0) {
								goto('/manage-customers');
								return;
							}
							selectedCustomer = {
								label: v.label ?? '',
								value: v.value
							};
							$formData.customerId = v.value;
						}
					}}
					disabled={existingOrder?.customerId !== undefined}
				>
					<Select.Trigger {...attrs} class="w-full">
						<Select.Value placeholder="Select customer" />
					</Select.Trigger>
					<Select.Content>
						{#each customers as customer}
							<Select.Item value={customer.id} label={customer.name} />
						{:else}
							<Select.Item value={0}>
								<div class="flex items-center gap-2">
									<Plus class="h-4 w-4" />
									<span>Add a customer first</span>
								</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.customerId} name={attrs.name} />
				<Form.FieldErrors class="mt-1 text-sm" />
			</Form.Control>
		</Form.Field>
	</div>

	<div class="flex items-start gap-4">
		<div class="min-h-[80px] flex-grow">
			<Form.Field {form} name="inventoryItemId">
				<Form.Control let:attrs>
					<Form.Label>Inventory Item</Form.Label>
					<Select.Root
						selected={selectedInventoryItem}
						onSelectedChange={(v) => {
							if (v) {
								if (v.value === 0) {
									goto('/manage-orders');
									return;
								}
								selectedInventoryItem = {
									label: v.label ?? '',
									value: v.value
								};
								$formData.inventoryItemId = v.value;

								const item = inventoryItems.find((i) => i.id === v.value);
								stockAvailable = (item?.stockIn ?? 0) - (item?.stockOut ?? 0);

								$formData.sellingPrice = item?.product.price ?? 0;
								$formData.quantity = stockAvailable;
							}
						}}
					>
						<Select.Trigger {...attrs} class="w-full">
							<Select.Value placeholder="Select inventory item" />
						</Select.Trigger>
						<Select.Content>
							{#each inventoryItems as inventoryItem}
								<Select.Item value={inventoryItem.id} label={inventoryItem.product.name} />
							{:else}
								<Select.Item value={0}>
									<div class="flex items-center gap-2">
										<Plus class="h-4 w-4" />
										<span>Purchase an item first</span>
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.inventoryItemId} name={attrs.name} />
					<Form.FieldErrors class="mt-1 text-sm" />
				</Form.Control>
			</Form.Field>
		</div>

		<div class="min-h-[80px] w-40">
			<Form.Field {form} name="quantity">
				<Form.Control let:attrs>
					<Form.Label>Qty: {stockAvailable ? `(Available ${stockAvailable})` : ''}</Form.Label>
					<Input
						{...attrs}
						type="number"
						bind:value={$formData.quantity}
						placeholder="Qty"
						disabled={stockAvailable === 0}
					/>
					<Form.FieldErrors class="mt-1 text-sm" />
				</Form.Control>
			</Form.Field>
		</div>

		<div class="min-h-[80px] w-40">
			<Form.Field {form} name="sellingPrice">
				<Form.Control let:attrs>
					<Form.Label>Selling Price</Form.Label>
					<Input
						{...attrs}
						type="number"
						bind:value={$formData.sellingPrice}
						step="0.01"
						placeholder="Selling Price"
					/>
					<Form.FieldErrors class="mt-1 text-sm" />
				</Form.Control>
			</Form.Field>
		</div>

		<div class="flex min-h-[80px] items-end">
			<Form.Button type="submit" class="mb-2 w-44">
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Adding...
				{:else}
					Add to Sale
				{/if}
			</Form.Button>
		</div>
	</div>
</form>
