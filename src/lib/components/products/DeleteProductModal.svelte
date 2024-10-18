<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { Product } from '$lib/db/schema';

	let open = $state(false);
	let isSubmitting = $state(false);

	let { selectedProducts, onSelect } = $props<{
		selectedProducts: Product[];
		onSelect: () => void;
	}>();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}
		>Delete {selectedProducts.length} Product/s</Dialog.Trigger
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete {selectedProducts.length} Product/s</Dialog.Title>
			<Dialog.Description>Are you sure you want to delete these products?</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/deleteProducts"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async function ({ result, update }) {
					isSubmitting = false;
					await update();
					if (result.type === 'success') {
						toast.success('Products deleted successfully');
						open = false;
						onSelect();
					}
				};
			}}
		>
			{#each selectedProducts as product}
				<input type="hidden" name="productIds" value={product.id} />
			{/each}
			<Dialog.Footer>
				<Dialog.Close>
					<Button variant="outline">Cancel</Button>
				</Dialog.Close>
				<Button type="submit" variant="destructive" disabled={isSubmitting}>
					{isSubmitting ? 'Deleting...' : 'Delete Products'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
