<script lang="ts">
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { customerSchema, type CustomerSchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Loader2, Plus } from 'lucide-svelte';

	interface Props {
		data: SuperValidated<CustomerSchema>;
	}

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(customerSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Customer added successfully`);
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	let selectedPosition = $state({
		label: $formData.position,
		value: $formData.position
	});
</script>

<form action="?/addCustomer" method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="position">
		<Form.Control let:attrs>
			<Form.Label>Position</Form.Label>
			<Select.Root
				{...attrs}
				selected={{ label: $formData.position, value: $formData.position }}
				onSelectedChange={(v) => {
					if (v) {
						selectedPosition = {
							label: (v.label as any) ?? 'GUEST',
							value: v.value
						};
						$formData.position = v.value;
					}
				}}
			>
				<Select.Trigger>
					<Select.Value placeholder="Select a position" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="GUEST">Guest</Select.Item>
					<Select.Item value="REPRESENTATIVE">Representative</Select.Item>
					<Select.Item value="VENDOR">Vendor</Select.Item>
					<Select.Item value="EMPLOYEE">Employee</Select.Item>
					<Select.Item value="OTHER">Other</Select.Item>
				</Select.Content>
				<input hidden bind:value={$formData.position} name={attrs.name} />
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="mt-4 w-full">
		{#if $submitting}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			Adding...
		{:else}
			<Plus class="mr-2 h-4 w-4" />
			Add Category
		{/if}
	</Form.Button>
</form>
