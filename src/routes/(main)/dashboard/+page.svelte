<script lang="ts">
	import * as d3 from 'd3';
	import * as Card from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';

	let barChartElement: HTMLDivElement;

	const overviewData = $state([
		{ title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', icon: '$' },
		{ title: 'Subscriptions', value: '+2350', change: '+180.1% from last month', icon: '👥' },
		{ title: 'Sales', value: '+12,234', change: '+19% from last month', icon: '📊' },
		{ title: 'Active Now', value: '+573', change: '+201 since last hour', icon: '📈' }
	]);

	const barChartData = $state([
		{ date: '2023-01-01', value: 30 },
		{ date: '2023-01-02', value: 50 },
		{ date: '2023-01-03', value: 20 },
		{ date: '2023-01-04', value: 80 },
		{ date: '2023-01-05', value: 40 },
		{ date: '2023-01-06', value: 60 },
		{ date: '2023-01-07', value: 70 }
	]);

	const recentSales = $state([
		{ name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
		{ name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
		{ name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
		{ name: 'William Kim', email: 'will@email.com', amount: '+$99.00' }
	]);

	$effect(() => {
		createBarChart();
	});

	function createBarChart() {
		const margin = { top: 10, right: 10, bottom: 20, left: 10 };
		const width = 600 - margin.left - margin.right;
		const height = 200 - margin.top - margin.bottom;

		d3.select(barChartElement).selectAll('*').remove();

		const svg = d3
			.select(barChartElement)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3.scaleBand().range([0, width]).padding(0.4);
		const y = d3.scaleLinear().range([height, 0]);

		x.domain(barChartData.map((d) => d.date));
		y.domain([0, d3.max(barChartData, (d) => d.value) ?? 0]);

		svg
			.selectAll('.bar')
			.data(barChartData)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (d) => x(d.date) ?? 0)
			.attr('width', x.bandwidth())
			.attr('y', (d) => y(d.value))
			.attr('height', (d) => height - y(d.value))
			.attr('fill', 'hsl(var(--primary) / 0.5)');

		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x).tickSize(0))
			.call((g) => g.select('.domain').remove());

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
</script>

<div class="container mx-auto mt-4 p-4">
	<h2 class="mb-6 text-2xl font-bold">Welcome back 👋</h2>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each overviewData as item}
			<Card.Root>
				<Card.Content class="p-4">
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium text-muted-foreground">{item.title}</p>
						<span class="text-2xl">{item.icon}</span>
					</div>
					<p class="text-2xl font-bold">{item.value}</p>
					<p class="text-xs text-muted-foreground">{item.change}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
		<Card.Root class="col-span-4">
			<Card.Header>
				<Card.Title>Overview</Card.Title>
			</Card.Header>
			<Card.Content>
				<div bind:this={barChartElement}></div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="col-span-3">
			<Card.Header>
				<Card.Title>Recent Sales</Card.Title>
				<Card.Description>You made 265 sales this month.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-8">
					{#each recentSales as sale}
						<div class="flex items-center">
							<Avatar class="h-9 w-9">
								<AvatarImage src={`https://avatar.vercel.sh/${sale.name}.png`} alt={sale.name} />
								<AvatarFallback>{sale.name[0]}{sale.name.split(' ')[1][0]}</AvatarFallback>
							</Avatar>
							<div class="ml-4 space-y-1">
								<p class="text-sm font-medium leading-none">{sale.name}</p>
								<p class="text-sm text-muted-foreground">{sale.email}</p>
							</div>
							<div class="ml-auto font-medium">{sale.amount}</div>
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
