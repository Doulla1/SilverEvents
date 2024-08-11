<script>
	import { goto } from '$app/navigation';
	let email = '';
	let password = '';
	let errorMessage = '';

	async function login() {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const result = await response.json();

			if (response.ok) {
				console.log(result);
				await goto('/dashboard');
			} else {
				errorMessage = result.message;
			}
		} catch (error) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
		}
	}
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="max-w-md w-full bg-white shadow-md rounded-lg p-8">
		<h1 class="text-2xl font-bold mb-6 text-gray-800">Connexion</h1>
		<form on:submit|preventDefault={login}>
			<div class="mb-4">
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input id="email" bind:value={email} type="email" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>
			<div class="mb-4">
				<label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
				<input id="password" bind:value={password} type="password" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>
			<div>
				<button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Se connecter
				</button>
			</div>
		</form>
		{#if errorMessage}
			<p class="mt-4 text-red-500 text-sm">{errorMessage}</p>
		{/if}
	</div>
</main>
