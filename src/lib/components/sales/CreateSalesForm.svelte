<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { buttonVariants } from '$lib/components/ui/button';

	let isSubmitting = $state(false);

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Create Sales</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Sales</Dialog.Title>
		</Dialog.Header>
		<Dialog.Description>Are you sure you want to create a sales order?</Dialog.Description>
		<form
			method="POST"
			action={`?/createSales`}
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					await update();
					if (result.type === 'success') {
						open = false;
					}
				};
			}}
		>
			<Dialog.Footer>
				<Dialog.Close asChild>
					<Button variant="outline">Cancel</Button>
				</Dialog.Close>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Creating...' : 'Create'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
