<script>
	import { Toaster } from 'svelte-sonner';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { navigating } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';

	import '../app.css';
</script>

<Toaster />
{#if $navigating}
	<div
		class="animate-loading-gradient fixed left-0 right-0 top-0 z-50 h-1 bg-gradient-to-r from-blue-500/50 via-blue-600/50 to-blue-500/50 bg-[length:200%_100%]"
	></div>
{/if}
<div class="flex h-screen">
	<aside class="fixed left-0 top-0 h-full w-64 overflow-y-auto">
		<Sidebar />
	</aside>

	<div class="ml-64 flex flex-1 flex-col">
		<nav class="bg-white p-3">
			<div class="container mx-auto flex items-center justify-end">
				<div>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</div>
		</nav>
		<main class="flex-1 overflow-y-auto">
			<slot />
		</main>
	</div>
</div>

<style>
	@keyframes loading {
		0% {
			background-position: 200% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.animate-loading-gradient {
		animation: loading 2s linear infinite;
	}
</style>
