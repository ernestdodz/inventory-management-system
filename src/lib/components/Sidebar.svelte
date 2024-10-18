<script lang="ts">
	import { Button } from '$lib/components/ui/button';
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
			path: '/'
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
				{ name: 'Manage Orders', path: '/manage-orders' },
				{ name: 'Manage Customers', path: '/manage-customers' }
			]
		},
		{
			name: 'Purchases',
			icon: CreditCard,
			subItems: [
				{ name: 'Manage Receiving', path: '/manage-receiving' },
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

	function toggleExpand(itemName: string) {
		expandedItem = expandedItem === itemName ? null : itemName;
	}
</script>

<div class="h-screen w-64 overflow-y-auto overflow-x-hidden border-r border-gray-300 bg-gray-100">
	<div class="flex items-center justify-between border-b border-gray-300 px-5 py-8">
		<div class="flex items-center">
			<Box class="mr-2 h-6 w-6 text-gray-600" />
			<h1 class="text-xl font-bold">Inventory MS</h1>
		</div>
		<div
			class="-mr-8 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-300"
		>
			<ChevronLeft class="h-5 w-5 text-gray-600" />
		</div>
	</div>
	<nav class="mt-4 px-2">
		{#each menuItems as item}
			<div class="mb-2">
				<Button
					variant="ghost"
					class="w-full justify-between px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
					href={item.path}
					on:click={() => toggleExpand(item.name)}
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
				</Button>
				{#if expandedItem === item.name && item.subItems}
					<div class="ml-4 mt-1 space-y-1">
						{#each item.subItems as subItem}
							<Button
								variant="ghost"
								class="w-full justify-start px-4 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
								href={subItem.path}
							>
								{subItem.name}
							</Button>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</nav>
</div>
