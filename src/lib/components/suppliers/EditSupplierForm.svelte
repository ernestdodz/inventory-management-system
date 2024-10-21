<!-- <script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import type { Supplier } from '$lib/db/schema/supplier-schema';
	import type { Product, ProductCategory } from '$lib/db/schema/product-schema';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { supplierSchema, type SupplierSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';

	let { data, supplier } = $props<{
		data: SuperValidated<SupplierSchema>;
		supplier: Supplier;
	}>();

	let open = $state(false);

	const form: SuperForm<SupplierSchema> = superForm(data, {
		id: `edit-supplier-${supplier.id}`,
		validators: zodClient(supplierSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Supplier updated successfully`);
				open = false;
			}
		}
	});

	const { form: formData, enhance: editEnhance, submitting, errors } = form;

	function updateFormData() {
		formData.update(() => ({
			id: supplier.id,
			name: supplier.name,
			email: supplier.email,
			address: supplier.address,
			phone: supplier.phone
		}));
	}

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
			<Dialog.Title>Edit Supplier</Dialog.Title>
		</Dialog.Header>
	</Dialog.Content>
		<form method="POST" action="?/editSupplier" class="space-y-4" use:editEnhance>
			<Form.Field {form} name="id">
				<Form.Control let:attrs>
					<Input {...attrs} bind:value={$formData.id} type="hidden" />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>

		</form>
	</Dialog.Content>
</Dialog.Root> -->
