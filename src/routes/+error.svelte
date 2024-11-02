<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-background">
	<div class="mx-auto max-w-md text-center">
		<h1 class="text-9xl font-bold text-primary">404</h1>
		<h2 class="mt-4 text-2xl font-semibold text-foreground">
			{$page.error?.message || 'Page Not Found'}
		</h2>
		<p class="mt-2 text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
		<div class="mt-8">
			<Button variant="outline" href="/" class="inline-flex items-center gap-2">
				<ArrowLeft class="h-4 w-4" />
				Back to Home
			</Button>
		</div>
	</div>
</div>
