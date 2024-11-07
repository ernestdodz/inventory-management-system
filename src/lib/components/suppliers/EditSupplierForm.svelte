<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import type { Supplier } from '$lib/db/schema';
	import { supplierSchema, type SupplierSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Edit, Loader2 } from 'lucide-svelte';

	interface Props {
		data: SuperValidated<SupplierSchema>;
		supplier: Supplier;
	}
	let { data, supplier }: Props = $props();

	let open = $state(false);

	const form: SuperForm<SupplierSchema> = superForm(data, {
		id: `edit-supplier-${supplier.id}`,
		validators: zodClient(supplierSchema),
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success('Supplier updated successfully');
				open = false;
			}
		}
	});

	const { form: formData, enhance: editEnhance, submitting, errors } = form;

	function updateFormData() {
		formData.update(() => ({
			id: supplier.id,
			name: supplier.name,
			address: supplier.address,
			phone: supplier.phone ?? '',
			email: supplier.email ?? ''
		}));
	}

	function handleDialogOpen() {
		open = true;
		updateFormData();
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'ghost' })} onclick={handleDialogOpen}>
		<Edit class="h-4 w-4" />
	</Dialog.Trigger>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Edit Supplier</Dialog.Title>
			<Dialog.Description>Update the details of the supplier.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/editSupplier" class="space-y-4" use:editEnhance>
			<Form.Field {form} name="id">
				<Form.Control let:attrs>
					<Input {...attrs} bind:value={$formData.id} type="hidden" />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="address">
				<Form.Control let:attrs>
					<Form.Label>Address</Form.Label>
					<Input {...attrs} bind:value={$formData.address} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="phone">
				<Form.Control let:attrs>
					<Form.Label>Phone</Form.Label>
					<Input {...attrs} bind:value={$formData.phone} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

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
