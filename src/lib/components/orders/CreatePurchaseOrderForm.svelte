<script lang="ts">
	import { Button, buttonVariants } from '../ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let open = $state(false);
	let isSubmitting = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Create PO</Dialog.Trigger>
	<Dialog.Content>
		<form
			action="?/createPurchaseOrder"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					await update();
					if (result.type === 'success') {
						goto('/manage-receiving');
						open = false;
					}
				};
			}}
		>
			<Dialog.Header>
				<Dialog.Title>Create Purchase Order</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>Are you sure you want to purchase these products?</Dialog.Description>
			<Dialog.Footer>
				<Dialog.Close asChild>
					<Button variant="outline">Cancel</Button>
				</Dialog.Close>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Purchasing...' : 'Purchase'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
