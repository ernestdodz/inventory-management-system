<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';

	const { data } = $props();

	console.log(data.recentActivities[0].product.name);

	const overviewData = $state([
		{
			title: 'Total Products',
			value: data.totalProducts,
			icon: '📦'
		},
		{
			title: 'Low Stock Items',
			value: data.totalLowStockItems,
			icon: '⚠️'
		},
		{
			title: 'Pending Orders',
			value: data.totalPendingPurchaseOrders,
			icon: '🛒'
		},
		{ title: 'Total Value', value: '$0', icon: '💰' }
	]);

	const user = $derived(data.session?.user);
</script>

<div class="container mx-auto">
	<div class="flex items-center justify-between">
		<h2 class="mb-6 text-2xl font-bold text-gray-700">Inventory Dashboard</h2>
		<p class="text-md capitalize text-muted-foreground">Welcome, {user?.name}</p>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each overviewData as item}
			<Card.Root>
				<Card.Content class="p-4">
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium text-muted-foreground">{item.title}</p>
						<span class="text-2xl">{item.icon}</span>
					</div>
					<p class="text-2xl font-bold">{item.value}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div class="mt-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>Recent Activities</Card.Title>
				<Card.Description>Latest updates in your inventory</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-8">
					{#each data.recentActivities as activity}
						<div class="flex items-center">
							<div class="flex items-center space-x-3">
								<div class="h-2 w-2 rounded-full bg-primary"></div>
								<div class="space-y-1">
									<p class="text-sm font-medium leading-none">{activity.product.name}</p>
									<p class="text-sm text-muted-foreground">
										Updated {activity.updatedAt
											? new Date(activity.updatedAt).toLocaleDateString()
											: 'N/A'}
									</p>
								</div>
							</div>
							<div class="ml-auto font-medium">
								{activity.stockIn
									? activity.stockIn > 0
										? `+${activity.stockIn}`
										: activity.stockIn
									: ''}
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
