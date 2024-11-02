<script lang="ts">
	import * as d3 from 'd3';
	import * as Card from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';

	let barChartElement: HTMLDivElement;

	const { data } = $props();

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
		{ title: 'Total Value', value: '$573,842', icon: '💰' }
	]);

	type ChartDataPoint = { date: Date; value: number };

	const barChartData = $state<ChartDataPoint[]>(
		d3.range(90).map((d) => ({
			date: d3.timeDay.offset(new Date(2023, 3, 1), d),
			value: Math.random() * 100
		}))
	);

	const recentActivities = $state([
		{ name: 'Product A', action: 'Restocked', amount: '+50 units' },
		{ name: 'Product B', action: 'Low Stock Alert', amount: '5 units left' },
		{ name: 'Product C', action: 'New Order', amount: '-20 units' },
		{ name: 'Product D', action: 'Updated Price', amount: 'Now $29.99' }
	]);

	$effect(() => {
		createBarChart();
	});

	function createBarChart() {
		const margin = { top: 10, right: 20, bottom: 30, left: 40 };
		const width = 500 - margin.left - margin.right;
		const height = 200 - margin.top - margin.bottom;

		d3.select(barChartElement).selectAll('*').remove();

		const svg = d3
			.select(barChartElement)
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr(
				'viewBox',
				`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
			)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3.scaleTime().range([0, width]);
		const y = d3.scaleLinear().range([height, 0]);

		x.domain(d3.extent(barChartData, (d) => d.date) as [Date, Date]);
		y.domain([0, d3.max(barChartData, (d) => d.value) ?? 0]);

		const barWidth = Math.max(1, width / barChartData.length - 1);

		svg
			.selectAll('.bar')
			.data(barChartData)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (d) => x(d.date))
			.attr('width', barWidth)
			.attr('y', (d) => y(d.value))
			.attr('height', (d) => height - y(d.value))
			.attr('fill', 'hsl(var(--primary) / 0.5)');

		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(
				d3
					.axisBottom(x)
					.ticks(d3.timeMonth.every(1))
					.tickFormat((d) => d3.timeFormat('%b')(d as Date))
			)
			.call((g) => {
				g.select('.domain').remove();
				g.selectAll('.tick line').attr('y2', -height);
			});

		svg.append('g').call(d3.axisLeft(y).ticks(5));

		svg
			.selectAll('line.horizontalGrid')
			.data(y.ticks(5))
			.enter()
			.append('line')
			.attr('class', 'horizontalGrid')
			.attr('x1', 0)
			.attr('x2', width)
			.attr('y1', (d) => y(d))
			.attr('y2', (d) => y(d))
			.attr('stroke', 'hsl(var(--border))');
	}

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

	<div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
		<Card.Root class="col-span-4">
			<Card.Header>
				<Card.Title>Stock Level Trends</Card.Title>
			</Card.Header>
			<Card.Content class="mt-8">
				<div bind:this={barChartElement} class="h-[250px] w-full"></div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="col-span-3">
			<Card.Header>
				<Card.Title>Recent Activities</Card.Title>
				<Card.Description>Latest updates in your inventory</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-8">
					{#each recentActivities as activity}
						<div class="flex items-center">
							<Avatar class="h-9 w-9">
								<AvatarImage
									src={`https://avatar.vercel.sh/${activity.name}.png`}
									alt={activity.name}
								/>
								<AvatarFallback>{activity.name[0]}</AvatarFallback>
							</Avatar>
							<div class="ml-4 space-y-1">
								<p class="text-sm font-medium leading-none">{activity.name}</p>
								<p class="text-sm text-muted-foreground">{activity.action}</p>
							</div>
							<div class="ml-auto font-medium">{activity.amount}</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>

<style>
	:global(.bar:hover) {
		fill: hsl(var(--primary));
	}
	:global(.horizontalGrid) {
		stroke-width: 0.5;
		stroke-opacity: 0.3;
	}
</style>
