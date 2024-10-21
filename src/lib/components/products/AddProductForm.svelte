<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import type { Supplier } from '$lib/db/schema/supplier-schema';
	import type { ProductCategory } from '$lib/db/schema/product-schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { productSchema, type ProductSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';

	interface Props {
		data: SuperValidated<ProductSchema>;
		categories: ProductCategory[];
		suppliers: Supplier[];
	}

	let { data, categories, suppliers }: Props = $props();

	let open = $state(false);

	const form: SuperForm<ProductSchema> = superForm(data, {
		validators: zodClient(productSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Product added successfully`);
				open = false;
				selectedCategory = { label: '', value: 0 };
				selectedSupplier = { label: '', value: 0 };

				form.reset();
			}
		}
	});

	const { form: formData, enhance, submitting, errors } = form;

	let selectedCategory = $state({
		label: '',
		value: $formData.categoryId
	});

	let selectedSupplier = $state({
		label: '',
		value: $formData.supplierId
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Add Product</Dialog.Trigger>
	<Dialog.Content class="max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Add New Product</Dialog.Title>
			<Dialog.Description>
				Fill in the details of the new product you want to add.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/addProduct" class="space-y-4" use:enhance>
			<Form.Field {form} name="id">
				<Form.Control let:attrs>
					<Input {...attrs} type="hidden" />
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
										{console.log(supplier)}
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
				<Form.Button type="submit">
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Adding...
					{:else}
						Add Product
					{/if}
				</Form.Button>
			</div>
		</form>

		{#if $errors._errors}
			<p class="mt-2 text-red-500">{$errors._errors[0]}</p>
		{/if}
	</Dialog.Content>
</Dialog.Root>
