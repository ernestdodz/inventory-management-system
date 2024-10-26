<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	let isSubmitting = $state(false);

	const { loadedPoCode }: { loadedPoCode: string } = $props();
</script>

<form
	action="?/addInventory&poCode={loadedPoCode}"
	method="POST"
	use:enhance={() => {
		isSubmitting = true;
		return async function ({ result, update }) {
			isSubmitting = false;
			await update();
			if (result.type === 'success') {
				toast.success('Inventory added successfully');
			}
		};
	}}
>
	<Button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Completing...' : 'Complete Receiving'}
	</Button>
</form>
