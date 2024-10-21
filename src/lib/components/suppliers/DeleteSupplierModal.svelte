<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { Supplier } from '$lib/db/schema';

	let open = $state(false);
	let isSubmitting = $state(false);

	let { selectedSuppliers, onSelect } = $props<{
		selectedSuppliers: Supplier[];
		onSelect: () => void;
	}>();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}
		>Delete {selectedSuppliers.length} Supplier/s</Dialog.Trigger
	>
	<Dialog.Content class="max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Delete {selectedSuppliers.length} Supplier/s</Dialog.Title>
			<Dialog.Description>Are you sure you want to delete these suppliers?</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/deleteSuppliers"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async function ({ result, update }) {
					isSubmitting = false;
					await update();
					if (result.type === 'success') {
						toast.success('Suppliers deleted successfully');
						open = false;
						onSelect();
					}
				};
			}}
		>
			{#each selectedSuppliers as supplier}
				<input type="hidden" name="supplierIds" value={supplier.id} />
			{/each}
			<Dialog.Footer>
				<Dialog.Close>
					<Button variant="outline">Cancel</Button>
				</Dialog.Close>
				<Button type="submit" variant="destructive" disabled={isSubmitting}>
					{isSubmitting ? 'Deleting...' : 'Delete Suppliers'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
