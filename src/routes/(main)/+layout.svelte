<script>
	import { navigating } from '$app/stores';

	import Sidebar from '$lib/components/Sidebar.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	const { data } = $props();

	const user = $derived(data.session?.user);
</script>

{#if $navigating}
	<div class="fixed left-0 right-0 top-0 z-50 h-1 overflow-hidden bg-gray-100">
		<div class="animate-progress-loop h-full w-full bg-blue-500" />
	</div>
{/if}

<div class="flex h-screen">
	<aside class="fixed left-0 top-0 h-full w-64 overflow-y-auto">
		<Sidebar />
	</aside>

	<div class="ml-64 flex flex-1 flex-col">
		<Navbar {user} />
		<main class="-mt-2 flex-1 overflow-y-auto">
			<slot />
		</main>
	</div>
</div>
