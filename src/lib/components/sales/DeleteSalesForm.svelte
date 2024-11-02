<script lang="ts">
	import { Button, buttonVariants } from '../ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { Trash2 } from 'lucide-svelte';
	import type { SalesOrderCartItem } from '$lib/db/schema/sales-order-schema';
	import { toast } from 'svelte-sonner';

	let open = $state(false);
	let isSubmitting = $state(false);

	interface Props {
		salesOrderItem: SalesOrderCartItem;
	}
	const { salesOrderItem }: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'ghost' })}
		><Trash2 class="h-4 w-4" /></Dialog.Trigger
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Sales Order Item</Dialog.Title>
			<Dialog.Description>Are you sure you want to delete this sales order item?</Dialog.Description
			>
		</Dialog.Header>
		<form
			action="?/deleteSalesItem"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async function ({ result, update }) {
					isSubmitting = false;
					await update();
					if (result.type === 'success') {
						toast.success('Sales order deleted successfully');
						open = false;
					}
				};
			}}
		>
			<input type="hidden" name="salesOrderItemId" value={salesOrderItem.id} />
			<Dialog.Footer>
				<Dialog.Close>
					<Button variant="outline">Cancel</Button>
				</Dialog.Close>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Deleting...' : 'Delete'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
