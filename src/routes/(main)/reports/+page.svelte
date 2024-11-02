<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import {
		FileSpreadsheet,
		Download,
		BarChart2,
		Package,
		ShoppingCart,
		Users
	} from 'lucide-svelte';

	const exportOptions = [
		{
			title: 'Inventory Report',
			description: 'Export current inventory levels, stock movements, and product details',
			icon: Package,
			formats: ['Excel', 'CSV']
		},
		{
			title: 'Sales Report',
			description: 'Export sales transactions, customer details, and revenue analysis',
			icon: ShoppingCart,
			formats: ['Excel', 'CSV']
		},
		{
			title: 'Stock Movement Report',
			description: 'Export detailed stock in/out movements and transfer history',
			icon: BarChart2,
			formats: ['Excel', 'CSV']
		},
		{
			title: 'Customer Report',
			description: 'Export customer information, purchase history, and contact details',
			icon: Users,
			formats: ['Excel', 'CSV']
		}
	];
</script>

<div class="container mx-auto space-y-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Export Reports</h1>
		<p class="text-muted-foreground">Download system data in various formats</p>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		{#each exportOptions as option}
			<Card.Root>
				<Card.Header>
					<div class="flex items-center space-x-4">
						<div class="rounded-lg bg-primary/10 p-3">
							<svelte:component this={option.icon} class="h-6 w-6 text-primary" />
						</div>
						<div>
							<Card.Title>{option.title}</Card.Title>
							<Card.Description>{option.description}</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="flex space-x-2">
						{#each option.formats as format}
							<form method="POST" action="?/export">
								<input type="hidden" name="reportType" value={option.title} />
								<input type="hidden" name="format" value={format} />
								<Button variant="outline" size="sm">
									{#if format === 'Excel'}
										<FileSpreadsheet class="mr-2 h-4 w-4" />
									{:else}
										<Download class="mr-2 h-4 w-4" />
									{/if}
									Export as {format}
								</Button>
							</form>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div class="rounded-lg border bg-card p-4 text-card-foreground">
		<div class="flex items-center space-x-4">
			<div class="rounded-lg bg-primary/10 p-3">
				<BarChart2 class="h-6 w-6 text-primary" />
			</div>
			<div>
				<h3 class="text-lg font-semibold">Custom Date Range Export</h3>
				<p class="text-sm text-muted-foreground">
					Export data for a specific time period across all categories
				</p>
			</div>
		</div>
		<div class="mt-4">
			<Button variant="outline">Configure Custom Export</Button>
		</div>
	</div>
</div>
