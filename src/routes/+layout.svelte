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
		<nav class="bg-white py-8">
			<div class="container mx-auto flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
						/>
					</svg>
					<div class="flex items-center text-sm">
						<a href="/" class="text-gray-500 hover:text-gray-700">Dashboard</a>
						<span class="mx-2 text-gray-400">/</span>
						<span class="font-medium text-gray-700">Overview</span>
					</div>
				</div>
				<div>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</div>
		</nav>
		<main class="-mt-2 flex-1 overflow-y-auto">
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
