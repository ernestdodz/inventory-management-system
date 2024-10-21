<script lang="ts">
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { supplierSchema, type SupplierSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import type { SuperForm } from 'sveltekit-superforms';
	import { buttonVariants } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { Loader2 } from 'lucide-svelte';

	let { data } = $props<{
		data: SuperValidated<SupplierSchema>;
	}>();

	let open = $state(false);

	const form: SuperForm<SupplierSchema> = superForm(data, {
		validators: zodClient(supplierSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Supplier added successfully`);
				open = false;
			}
		}
	});

	const { form: formData, enhance, submitting, errors } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Add Supplier</Dialog.Trigger>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Add New Supplier</Dialog.Title>
			<Dialog.Description>Add a new supplier to the system.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/addSupplier" class="space-y-4" use:enhance>
			<Form.Field {form} name="id">
				<Form.Control let:attrs>
					<Input {...attrs} type="hidden" />
					<Form.FieldErrors />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} type="text" bind:value={$formData.name} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="address">
				<Form.Control let:attrs>
					<Form.Label>Address</Form.Label>
					<Input {...attrs} type="text" bind:value={$formData.address} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="phone">
				<Form.Control let:attrs>
					<Form.Label>Phone</Form.Label>
					<Input {...attrs} type="text" bind:value={$formData.phone} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} type="text" bind:value={$formData.email} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<div class="flex justify-end space-x-2">
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Form.Button>
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Adding...
					{:else}
						Add Supplier
					{/if}
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
