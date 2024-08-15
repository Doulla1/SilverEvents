<script lang="ts">
	let oldPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let errorMessage = '';
	let successMessage = '';

	async function changePassword() {
		if (newPassword !== confirmPassword) {
			errorMessage = 'Les nouveaux mots de passe ne correspondent pas.';
			return;
		}

		try {
			const response = await fetch('/api/profile/change-password', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ oldPassword, newPassword })
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = 'Mot de passe changé avec succès.';
			} else {
				errorMessage = result.message || 'Une erreur est survenue.';
			}
		} catch (error) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer : ' + error.message;
		}
	}
</script>

<div class="bg-white p-6 rounded-lg shadow-md">
	<h2 class="text-xl font-semibold mb-4">Changer de mot de passe</h2>
	<form on:submit|preventDefault={changePassword} class="space-y-4">
		<div>
			<label for="oldPassword" class="block text-sm font-medium text-gray-700">Ancien mot de passe</label>
			<input id="oldPassword" bind:value={oldPassword} type="password" required
						 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		</div>

		<div>
			<label for="newPassword" class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
			<input id="newPassword" bind:value={newPassword} type="password" required
						 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		</div>

		<div>
			<label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
			<input id="confirmPassword" bind:value={confirmPassword} type="password" required
						 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		</div>

		{#if successMessage}
			<p class="text-green-500">{successMessage}</p>
		{/if}
		{#if errorMessage}
			<p class="text-red-500">{errorMessage}</p>
		{/if}

		<button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
			Changer le mot de passe
		</button>
	</form>
</div>
