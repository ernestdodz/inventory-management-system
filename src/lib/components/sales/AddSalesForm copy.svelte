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
	import type { Product } from '$lib/db/schema/product-schema';

	interface Props {
		data: SuperValidated<SalesOrderCartItemSchema>;
		customers: Customer[];
		products: Product[];
	}
	let { data, customers, products }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(salesOrderCartItemSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Item added successfully`);
				selectedCustomer = { label: '', value: 0 };
				selectedProduct = { label: '', value: 0 };
				form.reset();
			}
		}
	});

	const { form: formData, enhance, submitting, errors } = form;

	let selectedCustomer = $state({
		label: '',
		value: $formData.customerId
	});
	let selectedProduct = $state({
		label: '',
		value: $formData.productId
	});
</script>

<form method="POST" action="?/addSalesItem" class="space-y-4" use:enhance>
	<div class="flex items-end space-x-4">
		<div class="w-96">
			<Form.Field {form} name="customerId">
				<Form.Control let:attrs>
					<Form.Label>Customer</Form.Label>
					<Select.Root
						selected={selectedCustomer}
						onSelectedChange={(v) => {
							if (v) {
								selectedCustomer = {
									label: v.label ?? '',
									value: v.value
								};
								$formData.customerId = v.value;
							}
						}}
					>
						<Select.Trigger {...attrs} class="w-full">
							<Select.Value placeholder="Select customer" />
						</Select.Trigger>
						<Select.Content>
							{#each customers as customer}
								<Select.Item value={customer.id} label={customer.name} />
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.customerId} name={attrs.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="flex-grow">
			<Form.Field {form} name="productId">
				<Form.Control let:attrs>
					<Form.Label>Product</Form.Label>
					<Select.Root
						selected={selectedProduct}
						onSelectedChange={(v) => {
							if (v) {
								selectedProduct = {
									label: v.label ?? '',
									value: v.value
								};
								$formData.productId = v.value;
							}
						}}
					>
						<Select.Trigger {...attrs} class="w-full">
							<Select.Value placeholder="Select product" />
						</Select.Trigger>
						<Select.Content>
							{#each products as product}
								<Select.Item value={product.id} label={product.name} />
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.productId} name={attrs.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="w-40">
			<Form.Field {form} name="quantity">
				<Form.Control let:attrs>
					<Form.Label>Qty</Form.Label>
					<Input
						{...attrs}
						type="number"
						bind:value={$formData.quantity}
						min="1"
						placeholder="Qty"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="w-40">
			<Form.Field {form} name="sellingPrice">
				<Form.Control let:attrs>
					<Form.Label>Additional Price</Form.Label>
					<Input
						{...attrs}
						type="number"
						bind:value={$formData.sellingPrice}
						min="0"
						step="0.01"
						placeholder="Additional Price"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Button type="submit" class="w-44">
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Adding...
			{:else}
				Add to Sale
			{/if}
		</Form.Button>
	</div>
</form>

{#if $errors._errors}
	<p class="mt-2 text-red-500">{$errors._errors[0]}</p>
{/if}
