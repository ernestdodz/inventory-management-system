<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { z } from 'zod';

	const credentialsSchema = z.object({
		email: z.string().email('Please enter a valid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters')
	});

	type Credentials = z.infer<typeof credentialsSchema>;

	const credentials = $state<Credentials>({
		email: 'demo@demo.com',
		password: 'password123'
	});

	let errors = $state<Partial<Record<keyof Credentials, string>>>({});

	const validateField = (field: keyof Credentials) => {
		try {
			credentialsSchema.shape[field].parse(credentials[field]);
			errors = { ...errors, [field]: undefined };
		} catch (error) {
			if (error instanceof z.ZodError) {
				errors = { ...errors, [field]: error.errors[0].message };
			}
		}
	};

	const signInWithGitHub = async () => {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/dashboard'
		});
	};

	let isSigningIn = $state(false);

	const signInWithEmailAndPassword = async () => {
		try {
			credentialsSchema.parse(credentials);
			await authClient.signIn.email(
				{
					email: credentials.email,
					password: credentials.password
				},
				{
					onRequest: () => {
						isSigningIn = true;
					},
					onSuccess: () => {
						isSigningIn = false;
						goto('/dashboard');
					}
				}
			);
		} catch (error) {
			if (error instanceof z.ZodError) {
				errors = error.errors.reduce(
					(acc, curr) => {
						const path = curr.path[0] as keyof Credentials;
						acc[path] = curr.message;
						return acc;
					},
					{} as Record<keyof Credentials, string>
				);
			}
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		await signInWithEmailAndPassword();
	};
</script>

<div class="flex min-h-screen">
	<div class="hidden w-1/2 bg-primary lg:block">
		<div class="flex h-full items-center justify-center px-12">
			<div class="text-center text-white">
				<h1 class="text-5xl font-bold">Inventory Management</h1>
				<p class="mt-4 text-xl">Streamline your inventory process with our easy-to-use platform.</p>
			</div>
		</div>
	</div>

	<div class="w-full lg:w-1/2">
		<div class="flex min-h-screen items-center justify-center px-6">
			<div class="w-full max-w-md space-y-8">
				<div class="text-center">
					<h2 class="text-3xl font-bold">Welcome Back</h2>
					<p class="mt-2 text-muted-foreground">Sign in to access your account</p>
				</div>

				<form class="mt-8 space-y-6" onsubmit={handleSubmit}>
					<div class="space-y-4">
						<div>
							<label for="email" class="block text-sm font-medium">Email</label>
							<input
								id="email"
								type="text"
								bind:value={credentials.email}
								oninput={() => validateField('email')}
								class="mt-1 block w-full rounded-md border border-input px-3 py-2"
								placeholder="Enter your email"
							/>
							{#if errors.email}
								<p class="mt-1 text-sm text-red-500">{errors.email}</p>
							{/if}
						</div>
						<div>
							<label for="password" class="block text-sm font-medium">Password</label>
							<input
								id="password"
								type="password"
								bind:value={credentials.password}
								oninput={() => validateField('password')}
								class="mt-1 block w-full rounded-md border border-input px-3 py-2"
								placeholder="Enter your password"
							/>
							{#if errors.password}
								<p class="mt-1 text-sm text-red-500">{errors.password}</p>
							{/if}
						</div>
					</div>

					<Button type="submit" class="w-full" disabled={isSigningIn}>
						{#if isSigningIn}
							<svg
								class="mr-2 h-4 w-4 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M21 12a9 9 0 1 1-6.219-8.56" />
							</svg>
							Signing in...
						{:else}
							Sign in with Email
						{/if}
					</Button>
				</form>

				<div class="relative my-4">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
					</div>
				</div>

				<Button variant="outline" class="w-full" on:click={signInWithGitHub}>
					<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
							clip-rule="evenodd"
						/>
					</svg>
					Sign in with GitHub
				</Button>
			</div>
		</div>
	</div>
</div>
