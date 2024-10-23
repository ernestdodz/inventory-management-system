<script lang="ts">
	import { CardFooter } from '$lib/components/ui/card';
	import { purchaseOrderSchema, type PurchaseOrderSchema } from '$lib/validation';
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import { Button } from '../ui/button';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { enhance } from '$app/forms';

	interface Props {
		data: SuperValidated<PurchaseOrderSchema>;
	}
	const { data }: Props = $props();
</script>

<CardFooter class="flex flex-col">
	<hr class="my-4 w-full border-t border-gray-200" />
	<div class="flex w-full items-center justify-between">
		<div class="text-xl font-bold">Total: $140</div>
		<div class="space-x-2">
			<form action="?/createPurchaseOrder" method="POST" use:enhance={async () => {}}>
				<input type="hidden" name="id" value="" />
				<input name="" value="" />
				<Button class="w-32" type="submit">Create PO</Button>
			</form>
		</div>
	</div>
</CardFooter>
