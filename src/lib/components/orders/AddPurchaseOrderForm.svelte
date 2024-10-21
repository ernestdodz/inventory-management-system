<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { purchaseOrderSchema, type PurchaseOrderSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { Supplier, Product } from '$lib/db/schema';
	import { toast } from 'svelte-sonner';

	interface Props {
		data: SuperValidated<PurchaseOrderSchema>;
		suppliers: Supplier[];
		products: Product[];
	}

	const { data, suppliers, products }: Props = $props();

	const form: SuperForm<PurchaseOrderSchema> = superForm(data, {
		validators: zodClient(purchaseOrderSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Purchase order added successfully`);
				selectedSupplier = { label: '', value: 0 };
				selectedProduct = { label: '', value: 0 };
			}
		}
	});

	const { form: formData, enhance, submitting, errors } = form;

	let selectedSupplier = $state({
		label: '',
		value: 0
	});
	let selectedProduct = $state({
		label: '',
		value: 0
	});
</script>

<Card>
	<CardHeader>
		<CardTitle>Purchase Order Details</CardTitle>
		<CardDescription>
			Add a supplier and product to start adding items to your purchase order.
		</CardDescription>
	</CardHeader>
	<CardContent>
		<form action="?/addPurchaseOrder" method="POST" use:enhance>
			<div class="flex items-start space-x-4">
				<div class="flex-grow">
					<Form.Field {form} name="supplierId">
						<Form.Control let:attrs>
							<Form.Label>Supplier</Form.Label>
							<Select.Root
								selected={selectedSupplier}
								onSelectedChange={(v) => {
									if (v) {
										selectedSupplier = {
											label: v.label ?? '',
											value: v.value
										};
										$formData.supplierId = v.value;
									}
								}}
							>
								<Select.Trigger {...attrs} class="w-full">
									<Select.Value placeholder="Select supplier" />
								</Select.Trigger>
								<Select.Content>
									{#each suppliers as supplier}
										<Select.Item value={supplier.id} label={supplier.name} />
									{/each}
								</Select.Content>
								<input hidden bind:value={$formData.supplierId} name={attrs.name} />
							</Select.Root>
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
								<input hidden bind:value={$formData.productId} name={attrs.name} />
							</Select.Root>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="w-24">
					<Form.Field {form} name="quantity">
						<Form.Control let:attrs>
							<Form.Label>Qty</Form.Label>
							<Input type="number" {...attrs} bind:value={$formData.quantity} placeholder="Qty" />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="mt-1 flex h-[66px] flex-col justify-end">
					<Form.Button type="submit" class="w-32">
						{#if $submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Adding...
						{:else}
							Add to PO
						{/if}
					</Form.Button>
				</div>
			</div>
		</form>
	</CardContent>
</Card>
