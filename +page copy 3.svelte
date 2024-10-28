<div class="flex min-h-screen">
	<div class="hidden w-1/2 bg-blue-600 lg:block">
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
					<h2 class="text-3xl font-bold">Log in</h2>
					<p class="mt-2 text-gray-600">Enter your credentials to access your account</p>
				</div>

				<form class="mt-8 space-y-6">
					<div>
						<label class="text-sm font-medium text-gray-700">Email</label>
						<input
							type="email"
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
							placeholder="Enter your email"
						/>
					</div>

					<div>
						<label class="text-sm font-medium text-gray-700">Password</label>
						<input
							type="password"
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
							placeholder="Enter your password"
						/>
					</div>

					<button
						type="submit"
						class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Log In
					</button>

					<div class="flex items-center justify-between">
						<a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-500"
							>Forgot Password?</a
						>
						<a href="/register" class="text-sm text-blue-600 hover:text-blue-500">Create Account</a>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
