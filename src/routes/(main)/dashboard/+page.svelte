<script>
	import { Chart, Svg, Axis, Bars } from 'layerchart';

	const chartData = [
		{ group: 'Laptops', date: '2023-01-01', value: 65000 },
		{ group: 'Laptops', date: '2023-02-01', value: 72000 },
		{ group: 'Laptops', date: '2023-03-01', value: 68000 },
		{ group: 'Smartphones', date: '2023-01-01', value: 54000 },
		{ group: 'Smartphones', date: '2023-02-01', value: 58000 },
		{ group: 'Smartphones', date: '2023-03-01', value: 61000 },
		{ group: 'Accessories', date: '2023-01-01', value: 34000 },
		{ group: 'Accessories', date: '2023-02-01', value: 39000 },
		{ group: 'Accessories', date: '2023-03-01', value: 42000 }
	];

	const options = {
		title: 'Inventory Levels Over Time',
		axes: {
			left: {
				mapsTo: 'value',
				scaleType: 'linear',
				title: 'Inventory Value ($)'
			},
			bottom: {
				mapsTo: 'date',
				scaleType: 'time'
			}
		},
		curve: 'curveMonotoneX',
		height: '400px'
	};
</script>

<div class="container mx-auto mt-4">
	<div class="my-2 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Inventory Management</h1>
	</div>

	<div class="mt-6"></div>
</div>
