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
	import {
		purchaseOrderItemSchema,
		type PurchaseOrderItemCookie,
		type PurchaseOrderCartItemSchema
	} from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { Supplier, Product } from '$lib/db/schema';

	import { toast } from 'svelte-sonner';

	interface Props {
		data: SuperValidated<PurchaseOrderCartItemSchema>;
		suppliers: Supplier[];
		products: Product[];
		existingOrder: PurchaseOrderItemCookie;
	}

	const { data, suppliers, products, existingOrder }: Props = $props();

	const form: SuperForm<PurchaseOrderCartItemSchema> = superForm(data, {
		validators: zodClient(purchaseOrderItemSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Purchase order added successfully`);
				selectedProduct = { label: '', value: 0 };
				$formData.supplierId = existingOrder?.supplierId ?? 0;
			} else {
				toast.error(`Failed to add purchase order`);
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	let selectedSupplier = $state({
		label: existingOrder ? suppliers.find((s) => s.id === existingOrder.supplierId)?.name : '',
		value: existingOrder?.supplierId ?? 0
	});
	let selectedProduct = $state({
		label: '',
		value: 0
	});

	$effect(() => {
		$formData.supplierId = existingOrder?.supplierId ?? 0;
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
		<form action="?/addPurchaseCartItem" method="POST" use:enhance>
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
								disabled={existingOrder?.supplierId !== undefined}
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
