<script>
	let first_name = '';
	let last_name = '';
	let email = '';
	let position = '';
	let successMessage = '';
	let errorMessage = '';

	async function createUser() {
		try {
			const response = await fetch('/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ first_name, last_name, email, position })
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = result.message;
				// Réinitialiser les champs
				first_name = '';
				last_name = '';
				email = '';
				position = '';
			} else {
				errorMessage = result.message;
			}
		} catch ( error ) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer: ' + error.message;
		}
	}
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="max-w-md w-full bg-white shadow-md rounded-lg p-8">
		<h1 class="text-2xl font-bold mb-6 text-gray-800">Créer un utilisateur</h1>
		<form on:submit|preventDefault={createUser} class="space-y-6">
			<div>
				<label for="first_name" class="block text-sm font-medium text-gray-700">Prénom</label>
				<input id="first_name" bind:value={first_name} type="text" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>
			<div>
				<label for="last_name" class="block text-sm font-medium text-gray-700">Nom</label>
				<input id="last_name" bind:value={last_name} type="text" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input id="email" bind:value={email} type="email" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>
			<div>
				<label for="position" class="block text-sm font-medium text-gray-700">Poste</label>
				<input id="position" bind:value={position} type="text" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>
			<button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Créer l'utilisateur
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
