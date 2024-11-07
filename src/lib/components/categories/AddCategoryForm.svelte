<script lang="ts">
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { categorySchema, type CategorySchema } from '$lib/validation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Loader2, Plus } from 'lucide-svelte';

	interface Props {
		data: SuperValidated<CategorySchema>;
	}
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(categorySchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Category added successfully`);
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	let selectedStatus = $state({
		label: 'Active',
		value: true
	});
</script>

<form action="?/addCategory" method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="status">
		<Form.Control let:attrs>
			<Form.Label>Status</Form.Label>
			<Select.Root
				{...attrs}
				selected={selectedStatus}
				onSelectedChange={(v) => {
					if (v) {
						selectedStatus = {
							label: v.label ?? '',
							value: v.value
						};
						$formData.status = v.value;
					}
				}}
			>
				<Select.Trigger>
					<Select.Value placeholder="Select a status" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={true}>Active</Select.Item>
					<!-- <Select.Item value={false}>Inactive</Select.Item> -->
				</Select.Content>
				<input hidden bind:value={$formData.status} name={attrs.name} />
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
