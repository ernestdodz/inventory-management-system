<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import type { ProductCategory } from '$lib/db/schema';

	interface Props {
		category: ProductCategory;
		isOpen: boolean;
		onClose: () => void;
	}
	let { category, isOpen, onClose }: Props = $props();

	let isSubmitting = $state(false);

	const closeDialog = () => {
		return onClose();
	};
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={closeDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete {category?.name}</Dialog.Title>
			<Dialog.Description>
				<p>Are you sure you want to delete this category?</p>
				<p>Deleting it would delete the products referenced to it.</p>
			</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/deleteCategory"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async function ({ result, update }) {
					isSubmitting = false;
					await update();
					if (result.type === 'success') {
						toast.success('Products deleted successfully');

						onClose();
					}
				};
			}}
		>
			<input type="hidden" name="categoryId" value={category?.id} />
			<Dialog.Footer>
				<Dialog.Close>
					<Button variant="outline">Cancel</Button>
				</Dialog.Close>
				<Button type="submit" variant="destructive" disabled={isSubmitting}>
					{isSubmitting ? 'Deleting...' : 'Delete Category'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
