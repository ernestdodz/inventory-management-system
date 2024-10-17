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
		ChevronRight,
		ChevronLeft
	} from 'lucide-svelte';

	const menuItems = [
		{
			name: 'Dashboard',
			icon: LayoutDashboard
		},
		{
			name: 'Inventory',
			icon: Package,
			subItems: ['Products', 'Categories', 'Stock']
		},
		{
			name: 'Sales',
			icon: ShoppingCart,
			subItems: ['Orders', 'Customers']
		},
		{
			name: 'Purchases',
			icon: CreditCard,
			subItems: ['Suppliers', 'Purchase Orders']
		},
		{
			name: 'Reports',
			icon: BarChart2
		}
	];

	let expandedItem = $state(null as string | null);

	function toggleExpand(itemName: string) {
		expandedItem = expandedItem === itemName ? null : itemName;
	}
</script>

<div class="h-screen w-64 overflow-y-auto border-r border-gray-300 bg-gray-200">
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
			<div class="mb-1">
				<Button
					variant="ghost"
					class="w-full justify-between px-4"
					onclick={() => toggleExpand(item.name)}
				>
					<div class="flex items-center">
						<item.icon class="h-4 w-4" />
						<span class="ml-2">{item.name}</span>
					</div>
					{#if item.subItems && item.subItems.length > 0}
						{#if expandedItem === item.name}
							<ChevronDown class="h-4 w-4" />
						{:else}
							<ChevronRight class="h-4 w-4" />
						{/if}
					{/if}
				</Button>
				{#if expandedItem === item.name && item.subItems}
					<div class="ml-6 mt-1">
						{#each item.subItems as subItem}
							<Button variant="ghost" class="w-full justify-start px-4 py-1 text-sm">
								{subItem}
							</Button>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</nav>
</div>
