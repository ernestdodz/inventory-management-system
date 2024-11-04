<script lang="ts">
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
		DropdownMenuSeparator
	} from '$lib/components/ui/dropdown-menu';
	import {
		Box,
		LayoutDashboard,
		Package,
		ShoppingCart,
		CreditCard,
		BarChart2
	} from 'lucide-svelte';
	import { authClient, type User } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const menuItems = [
		{
			name: 'Dashboard',
			icon: LayoutDashboard,
			path: '/dashboard'
		},
		{
			name: 'Inventory',
			icon: Package,
			subItems: [
				{ name: 'View All', path: '/inventory' },
				{ name: 'Manage Products', path: '/manage-products' },
				{ name: 'Manage Categories', path: '/manage-categories' }
			]
		},
		{
			name: 'Sales',
			icon: ShoppingCart,
			subItems: [
				{ name: 'Manage Sales', path: '/manage-sales' },
				{ name: 'Manage Customers', path: '/manage-customers' }
			]
		},
		{
			name: 'Purchases',
			icon: CreditCard,
			subItems: [
				{ name: 'Manage Receiving', path: '/manage-receiving' },
				{ name: 'Manage Orders', path: '/manage-orders' },
				{ name: 'Manage Suppliers', path: '/manage-suppliers' }
			]
		},
		{
			name: 'Reports',
			icon: BarChart2,
			path: '/reports'
		}
	];

	function getCurrentPageInfo() {
		const path = $page.url.pathname;
		for (const item of menuItems) {
			if (item.path === path) {
				return { parent: null, current: item.name };
			}
			if (item.subItems) {
				const subItem = item.subItems.find((sub) => sub.path === path);
				if (subItem) {
					return { parent: item.name, current: subItem.name };
				}
			}
		}
		return { parent: null, current: 'Overview' };
	}

	async function handleSignOut() {
		await authClient.signOut();
		goto('/');
	}

	interface Props {
		user: User | undefined;
	}

	const { user }: Props = $props();
	const pageInfo = $derived(getCurrentPageInfo());
</script>

<nav class="bg-white py-8">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<Box class="h-5 w-5 text-gray-400" />
			<div class="flex items-center text-sm">
				<a href="/" class="text-gray-500 hover:text-gray-700">
					{pageInfo.parent ?? 'Dashboard'}
				</a>
				<span class="mx-2 text-gray-400">/</span>
				<span class="font-medium text-gray-700">{pageInfo.current}</span>
			</div>
		</div>
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage src={user?.image ?? ''} alt={user?.name ?? 'User'} />
						<AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<div class="flex items-center gap-2 p-2">
						<Avatar class="h-8 w-8">
							<AvatarImage src={user?.image ?? ''} alt={user?.name ?? 'User'} />
							<AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
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
