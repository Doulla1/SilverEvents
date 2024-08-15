<script lang="ts">
	let email = '';
	let errorMessage = '';
	let successMessage = '';

	async function requestPasswordReset() {
		try {
			const response = await fetch('/api/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = result.message;
			} else {
				errorMessage = result.message || 'Une erreur est survenue.';
			}
		} catch (error) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
		}
	}
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="max-w-md w-full bg-white shadow-md rounded-lg p-8">
		<h1 class="text-2xl font-bold mb-6 text-gray-800">Veuillez renseigner votre email</h1>
		<form on:submit|preventDefault={requestPasswordReset} class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
				<input id="email" bind:value={email} type="email" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>
			<button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Réinitialiser le mot de passe
			</button>
		</form>

		{#if successMessage}
			<p class="mt-4 text-green-500 text-sm">{successMessage}</p>
		{/if}
		{#if errorMessage}
			<p class="mt-4 text-red-500 text-sm">{errorMessage}</p>
		{/if}
	</div>
</main>
