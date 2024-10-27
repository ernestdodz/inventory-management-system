<script lang="ts">
	import * as d3 from 'd3';
	import * as Card from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { onMount } from 'svelte';

	const overviewData = $state([
		{ title: 'Total Products', value: '1,234', change: '+20 from last month', icon: '📦' },
		{ title: 'Low Stock Items', value: '15', change: '-5 from last week', icon: '⚠️' },
		{ title: 'Out of Stock', value: '3', change: '-2 from last week', icon: '🚫' },
		{ title: 'Pending Orders', value: '25', change: '+5 since yesterday', icon: '🔄' }
	]);

	const inventoryData = $state([
		{ category: 'Electronics', count: 300, capacity: 500 },
		{ category: 'Clothing', count: 450, capacity: 600 },
		{ category: 'Books', count: 200, capacity: 300 },
		{ category: 'Home & Garden', count: 350, capacity: 400 },
		{ category: 'Toys', count: 150, capacity: 200 }
	]);

	function createGaugeChart(element: HTMLElement, data: { count: number; capacity: number }) {
		const width = 150;
		const height = 150;
		const radius = Math.min(width, height) / 2;
		const percentage = (data.count / data.capacity) * 100;

		const svg = d3
			.select(element)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		const arc = d3
			.arc<d3.DefaultArcObject>()
			.innerRadius(radius * 0.7)
			.outerRadius(radius)
			.startAngle(0)
			.endAngle((percentage / 100) * 2 * Math.PI);

		const backgroundArc = d3
			.arc<d3.DefaultArcObject>()
			.innerRadius(radius * 0.7)
			.outerRadius(radius)
			.startAngle(0)
			.endAngle(2 * Math.PI);

		svg
			.append('path')
			.attr('d', backgroundArc as any)
			.attr('fill', '#e6e6e6');

		svg
			.append('path')
			.attr('d', arc as any)
			.attr('fill', percentage < 30 ? '#ef4444' : percentage < 70 ? '#eab308' : '#22c55e');

		svg
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '0.35em')
			.attr('class', 'percentage')
			.text(`${Math.round(percentage)}%`);
	}

	onMount(() => {
		inventoryData.forEach((item, index) => {
			const gaugeElement = document.getElementById(`gauge-${index}`);
			if (gaugeElement) {
				createGaugeChart(gaugeElement, item);
			}
		});
	});
</script>

<div class="container mx-auto mt-4 p-4">
	<h2 class="mb-6 text-2xl font-bold">Inventory Dashboard</h2>

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

	<div class="mt-8">
		<Card.Root>
			<Card.Header>
				<Card.Title>Inventory Levels by Category</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
					{#each inventoryData as item, index}
						<div class="flex flex-col items-center">
							<div id={`gauge-${index}`}></div>
							<p class="mt-2 text-center font-medium">{item.category}</p>
							<p class="text-sm text-muted-foreground">{item.count} / {item.capacity}</p>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>

<style>
	:global(.percentage) {
		font-size: 24px;
		font-weight: bold;
	}
</style>
