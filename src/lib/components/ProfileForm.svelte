<script lang="ts">
	import { user } from '$lib/stores/user';

	let userData = { first_name: '', last_name: '', email: '', position: '' };
	let successMessage = '';
	let errorMessage = '';

	// Récupération des informations utilisateur à partir du store
	user.subscribe(value => {
		userData = { ...value };
	});

	// Fonction pour soumettre les modifications
	async function updateProfile() {
		console.log("Before update");
		console.log(userData);
		try {
			const response = await fetch('/api/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = 'Profil mis à jour avec succès.';
				user.set(result.user);
			} else {
				errorMessage = result.message || 'Une erreur est survenue lors de la mise à jour.';
			}
		} catch (error) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer : ' + error.message;
		}
	}
</script>

<div class="bg-white p-6 rounded-lg shadow-md">
	<h2 class="text-xl font-semibold mb-4">Modifier votre profil</h2>
	<form on:submit|preventDefault={updateProfile} class="space-y-4">
		<div>
			<label for="first_name" class="block text-sm font-medium text-gray-700">Prénom</label>
			<input id="first_name" bind:value={userData.first_name} type="text" required
						 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		</div>

		<div>
			<label for="last_name" class="block text-sm font-medium text-gray-700">Nom</label>
			<input id="last_name" bind:value={userData.last_name} type="text" required
						 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		</div>

		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<input id="email" bind:value={userData.email} type="email" required
						 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		</div>

		<div>
			<label for="position" class="block text-sm font-medium text-gray-700">Poste</label>
			<input id="position" bind:value={userData.position} type="text" required
						 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		</div>

		{#if successMessage}
			<p class="text-green-500">{successMessage}</p>
		{/if}
		{#if errorMessage}
			<p class="text-red-500">{errorMessage}</p>
		{/if}

		<button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
			Mettre à jour
		</button>
	</form>
</div>
