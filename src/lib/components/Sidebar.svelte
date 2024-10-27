<script lang="ts">
	import { page } from '$app/stores';
	import {
		LayoutDashboard,
		Package,
		ShoppingCart,
		CreditCard,
		Box,
		BarChart2,
		ChevronDown,
		ChevronLeft
	} from 'lucide-svelte';

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

	let expandedItem = $state(null as string | null);
	let activePath = $state('/');

	$effect(() => {
		activePath = $page.url.pathname;
	});

	function toggleExpand(itemName: string) {
		expandedItem = expandedItem === itemName ? null : itemName;
	}

	function isActive(item: (typeof menuItems)[number]) {
		if (activePath === item.path) return true;
		if (item.subItems) {
			return item.subItems.some((subItem) => activePath === subItem.path);
		}
		return false;
	}
</script>

<div class="h-screen w-64 overflow-y-auto overflow-x-hidden border-r border-gray-300 bg-gray-100">
	<div class="flex items-center justify-between px-5 py-8">
		<div class="flex items-center">
			<Box class="mr-2 h-6 w-6 text-gray-600" />
			<h1 class="text-xl font-bold text-gray-700">Inventory MS</h1>
		</div>
		<div
			class="-mr-8 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-300"
		>
			<ChevronLeft class="h-5 w-5 text-gray-600" />
		</div>
	</div>
	<nav class="px-2">
		{#each menuItems as item}
			<div class="mb-2">
				<a
					class="flex w-full items-center justify-between rounded-md px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
					href={item.path}
					onclick={() => toggleExpand(item.name)}
					class:active={isActive(item) && !item.subItems}
				>
					<div class="flex items-center">
						<item.icon class="mr-2 h-5 w-5" />
						<span class="font-medium">{item.name}</span>
					</div>
					{#if item.subItems && item.subItems.length > 0}
						<ChevronDown
							class={`h-4 w-4 ${expandedItem === item.name ? 'rotate-180 transform' : ''}`}
						/>
					{/if}
				</a>
				{#if expandedItem === item.name && item.subItems}
					<div class="ml-4 mt-1 space-y-1">
						{#each item.subItems as subItem}
							<a
								class="block w-full rounded-md px-4 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
								href={subItem.path}
								class:active={activePath === subItem.path}
							>
								{subItem.name}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</nav>
</div>

<style>
	.active {
		@apply bg-gray-200 font-semibold;
	}
</style>
