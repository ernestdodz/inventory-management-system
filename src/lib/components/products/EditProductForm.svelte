<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import type { Supplier } from '$lib/db/schema/supplier-schema';
	import type { Product, ProductCategory } from '$lib/db/schema/product-schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { productSchema, type ProductSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';

	let { data, product, categories, suppliers } = $props<{
		data: SuperValidated<ProductSchema>;
		product: Product;
		categories: ProductCategory[];
		suppliers: Supplier[];
	}>();

	let open = $state(false);

	const form: SuperForm<ProductSchema> = superForm(data, {
		id: `edit-product-${product.id}`,
		validators: zodClient(productSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Product updated successfully`);
				open = false;
			}
		}
	});

	const { form: formData, enhance: editEnhance, submitting, errors } = form;

	function updateFormData() {
		formData.update(() => ({
			id: product.id,
			sku: product.sku,
			name: product.name,
			description: product.description,
			categoryId: product.categoryId,
			price: product.price,
			supplierId: product.supplierId
		}));
	}

	let selectedCategory = $state({
		label: product.category.name,
		value: product.categoryId
	});

	let selectedSupplier = $state({
		label: product.supplier.name,
		value: product.supplierId
	});

	function handleDialogOpen() {
		open = true;
		updateFormData();
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })} onclick={handleDialogOpen}>
		Edit
	</Dialog.Trigger>
	<Dialog.Content class="max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Edit Product</Dialog.Title>
			<Dialog.Description>Update the details of the product.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/editProduct" class="space-y-4" use:editEnhance>
			<Form.Field {form} name="id">
				<Form.Control let:attrs>
					<Input {...attrs} bind:value={$formData.id} type="hidden" />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-4">
					<Form.Field {form} name="sku">
						<Form.Control let:attrs>
							<Form.Label>Sku</Form.Label>
							<Input {...attrs} bind:value={$formData.sku} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="name">
						<Form.Control let:attrs>
							<Form.Label>Name</Form.Label>
							<Input {...attrs} bind:value={$formData.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="description">
						<Form.Control let:attrs>
							<Form.Label>Description</Form.Label>
							<Input {...attrs} bind:value={$formData.description} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="space-y-4">
					<Form.Field {form} name="categoryId">
						<Form.Control let:attrs>
							<Form.Label>Category</Form.Label>
							<Select.Root
								selected={selectedCategory}
								onSelectedChange={(v) => {
									if (v) {
										selectedCategory = {
											label: v.label ?? '',
											value: v.value
										};
										$formData.categoryId = v.value;
									}
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select a category" />
								</Select.Trigger>
								<Select.Content>
									{#each categories as category}
										<Select.Item value={category.id} label={category.name} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.categoryId} name={attrs.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="price">
						<Form.Control let:attrs>
							<Form.Label>Price</Form.Label>
							<Input {...attrs} bind:value={$formData.price} type="number" />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
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
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select a supplier" />
								</Select.Trigger>
								<Select.Content>
									{#each suppliers as supplier}
										<Select.Item value={supplier.id} label={supplier.name} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.supplierId} name={attrs.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>

			<div class="flex justify-end space-x-2">
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Form.Button>
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Editing...
					{:else}
						Edit
					{/if}
				</Form.Button>
			</div>
		</form>

		{#if $errors._errors}
			<p class="mt-2 text-red-500">{$errors._errors[0]}</p>
		{/if}
	</Dialog.Content>
</Dialog.Root>
