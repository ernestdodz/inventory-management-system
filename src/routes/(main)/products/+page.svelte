<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import {
		ChevronDown,
		ChevronRight,
		LayoutDashboard,
		Package,
		ShoppingCart,
		CreditCard,
		Box,
		BarChart2,
		Menu,
		Users,
		ClipboardList,
		Truck,
		DollarSign,
		TrendingUp,
		AlertCircle
	} from 'lucide-svelte';

	let isCollapsed = false;
	let expandedSections: string[] = [];
	let activeItem = 'Dashboard';

	const toggleSection = (section: string) => {
		expandedSections = expandedSections.includes(section)
			? expandedSections.filter((item) => item !== section)
			: [...expandedSections, section];
	};

	const menuItems = [
		{ name: 'Dashboard', icon: LayoutDashboard },
		{
			name: 'Inventory',
			icon: Package,
			subItems: ['View All', 'Manage Products', 'Manage Categories']
		},
		{
			name: 'Sales',
			icon: ShoppingCart,
			subItems: ['View All', 'Manage Customers']
		},
		{
			name: 'Purchases',
			icon: CreditCard,
			subItems: ['View All', 'Manage Orders', 'Manage Suppliers']
		},
		{ name: 'Reports', icon: BarChart2 }
	];
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<div
		class="{isCollapsed
			? 'w-16'
			: 'w-64'} flex-shrink-0 border-r border-gray-300 bg-gray-200 transition-all duration-300 ease-in-out"
	>
		<div class="flex items-center border-b border-gray-300 p-5">
			{#if !isCollapsed}
				<Box class="h- mr-2 w-6 text-gray-600" />
				<h1 class="text-xl font-bold">Inventory MS</h1>
			{/if}
		</div>
		<ScrollArea class="h-[calc(100vh-64px)]">
			<nav class="p-2">
				{#each menuItems as item}
					<div>
						<Button
							variant={activeItem === item.name ? 'secondary' : 'ghost'}
							class="mb-1 w-full justify-start {isCollapsed ? 'px-2' : 'px-4'}"
							on:click={() => {
								activeItem = item.name;
								if (item.subItems) toggleSection(item.name);
							}}
						>
							<svelte:component this={item.icon} class="h-4 w-4" />
							{#if !isCollapsed}
								<span class="ml-2">{item.name}</span>
								{#if item.subItems}
									<span class="ml-auto">
										{#if expandedSections.includes(item.name)}
											<ChevronDown class="h-4 w-4" />
										{:else}
											<ChevronRight class="h-4 w-4" />
										{/if}
									</span>
								{/if}
							{/if}
						</Button>
						{#if !isCollapsed && item.subItems && expandedSections.includes(item.name)}
							<div class="ml-4 mt-1">
								{#each item.subItems as subItem}
									<Button
										variant={activeItem === subItem ? 'secondary' : 'ghost'}
										class="mb-1 w-full justify-start"
										on:click={() => (activeItem = subItem)}
									>
										{#if subItem === 'View All'}
											<ClipboardList class="mr-2 h-4 w-4" />
										{:else if subItem === 'Manage Products'}
											<Package class="mr-2 h-4 w-4" />
										{:else if subItem === 'Manage Categories'}
											<LayoutDashboard class="mr-2 h-4 w-4" />
										{:else if subItem === 'Manage Customers'}
											<Users class="mr-2 h-4 w-4" />
										{:else if subItem === 'Manage Orders'}
											<ShoppingCart class="mr-2 h-4 w-4" />
										{:else if subItem === 'Manage Suppliers'}
											<Truck class="mr-2 h-4 w-4" />
										{/if}
										<span>{subItem}</span>
									</Button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</nav>
		</ScrollArea>
	</div>

	<!-- Dashboard Content -->
	<div class="flex-grow overflow-auto">
		<div class="p-6">
			<h2 class="mb-6 text-2xl font-bold">Dashboard</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">$45,231.89</div>
						<p class="text-xs text-muted-foreground">+20.1% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Sales</CardTitle>
						<ShoppingCart class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">+2350</div>
						<p class="text-xs text-muted-foreground">+180.1% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Active Products</CardTitle>
						<Package class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					* <CardContent>
						<div class="text-2xl font-bold">456</div>
						<p class="text-xs text-muted-foreground">+19 from last month</p>
					</CardContent>
				</Card>
			</div>

			<div class="mt-6">
				<Card>
					<CardHeader>
						<CardTitle>Recent Activities</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div class="flex items-center">
								<TrendingUp class="mr-2 h-4 w-4 text-green-500" />
								<span class="text-sm">New order received - #1234</span>
							</div>
							<div class="flex items-center">
								<AlertCircle class="mr-2 h-4 w-4 text-yellow-500" />
								<span class="text-sm">Low stock alert - Product XYZ</span>
							</div>
							<div class="flex items-center">
								<Users class="mr-2 h-4 w-4 text-blue-500" />
								<span class="text-sm">New customer registered - John Doe</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</div>
