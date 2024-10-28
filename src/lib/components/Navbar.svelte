<script lang="ts">
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
		DropdownMenuSeparator
	} from '$lib/components/ui/dropdown-menu';
	import { Home } from 'lucide-svelte';
	import { authClient, type User } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	async function handleSignOut() {
		await authClient.signOut();
		goto('/');
	}

	interface Props {
		user: User | undefined;
	}

	const { user }: Props = $props();
</script>

<nav class="bg-white py-8">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<Home class="h-5 w-5 text-gray-400" />
			<div class="flex items-center text-sm">
				<a href="/" class="text-gray-500 hover:text-gray-700">Dashboard</a>
				<span class="mx-2 text-gray-400">/</span>
				<span class="font-medium text-gray-700">Overview</span>
			</div>
		</div>
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<div class="flex items-center gap-2 p-2">
						<Avatar class="h-8 w-8">
							<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div class="flex flex-col">
							<span class="text-sm font-medium">{user?.name ?? 'User'}</span>
							<span class="text-xs text-gray-500">{user?.email ?? ''}</span>
						</div>
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem onclick={handleSignOut}>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>
</nav>
