<script>
	import { Toaster } from 'svelte-sonner';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

	import '../app.css';
</script>

<Toaster />
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
