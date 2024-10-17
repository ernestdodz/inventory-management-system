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
		Users,
		ClipboardList,
		Truck
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

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<div
		class="{isCollapsed
			? 'w-16'
			: 'w-64'} flex-shrink-0 border-r border-gray-200 bg-[#f2f2f2] transition-all duration-300 ease-in-out"
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
	<div class="flex-grow overflow-auto bg-[#F5F5F5]">
		<div class="p-6">
			<h2 class="mb-6 text-2xl font-bold">Manage Product Categories</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Manage Categories Form -->
				<Card>
					<CardHeader>
						<CardTitle>Add/Edit Product Category</CardTitle>
					</CardHeader>
					<CardContent>
						<form class="space-y-4">
							<div class="space-y-2">
								<label for="name" class="text-sm font-medium">Category Name</label>
								<input id="name" type="text" class="w-full rounded-md border p-2" />
							</div>
							<div class="space-y-2">
								<label for="status" class="text-sm font-medium">Status</label>
								<select id="status" class="w-full rounded-md border p-2">
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
							</div>
							<Button class="w-full">Save Category</Button>
						</form>
					</CardContent>
				</Card>

				<!-- List of Categories -->
				<Card>
					<CardHeader>
						<CardTitle>Category List</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea class="h-[400px]">
							<table class="w-full">
								<thead>
									<tr>
										<th class="text-left">Name</th>
										<th class="text-left">Status</th>
										<th class="text-left">Actions</th>
									</tr>
								</thead>
								<tbody>
									<!-- Example categories, replace with actual data -->
									<tr>
										<td>Electronics</td>
										<td>Active</td>
										<td>
											<Button variant="outline" size="sm" class="mr-2">Edit</Button>
											<Button variant="outline" size="sm">Delete</Button>
										</td>
									</tr>
									<tr>
										<td>Clothing</td>
										<td>Active</td>
										<td>
											<Button variant="outline" size="sm" class="mr-2">Edit</Button>
											<Button variant="outline" size="sm">Delete</Button>
										</td>
									</tr>
									<!-- Add more rows as needed -->
								</tbody>
							</table>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</div>
