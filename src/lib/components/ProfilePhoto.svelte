<script lang="ts">
	import { user } from '$lib/stores/user';
	import { onDestroy } from 'svelte';

	let profilePhoto: File | null = null;
	let successMessage: string = '';
	let errorMessage: string = '';
	let currentPhoto: string | null = '';

	// S'abonner au store pour obtenir la photo actuelle
	const unsubscribe = user.subscribe((value) => {
		currentPhoto = value?.profile_photo || null;
	});

	onDestroy(() => {
		unsubscribe();
	});

	// Fonction pour télécharger la nouvelle photo de profil
	async function uploadPhoto() {
		if (!profilePhoto) return;

		const formData = new FormData();
		formData.append('profile_photo', profilePhoto);

		try {
			const response = await fetch('/api/profile/photo', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = 'Photo de profil mise à jour.';
				user.set(result.user); // Met à jour le store avec l'utilisateur mis à jour
				currentPhoto = result.user.profile_photo; // Met à jour la photo actuelle
			} else {
				errorMessage = result.message || 'Une erreur est survenue.';
			}
		} catch (error) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer : ' + error.message;
		}
	}

	// Fonction pour supprimer la photo de profil
	async function deletePhoto() {
		try {
			const response = await fetch('/api/profile/photo', {
				method: 'DELETE'
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = 'Photo de profil supprimée.';
				user.set(result.user); // Met à jour le store pour supprimer la photo
				currentPhoto = null;
			} else {
				errorMessage = result.message || 'Une erreur est survenue.';
			}
		} catch (error) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer : ' + error.message;
		}
	}
</script>

<div class="bg-white p-6 rounded-lg shadow-md mt-6">
	<h2 class="text-xl font-semibold mb-4">Photo de profil</h2>
	{#if currentPhoto}
		<img src={currentPhoto} alt="Profil" class="w-32 h-32 rounded-full mb-4" />
		<button on:click={deletePhoto} class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
			Supprimer la photo
		</button>
	{:else}
		<p class="text-gray-500">Pas de photo de profil actuellement.</p>
	{/if}

	<div class="mt-4">
		<input type="file" accept="image/*" on:change={(e) => profilePhoto = e.target.files ? e.target.files[0] : null}
					 class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
		<button on:click={uploadPhoto} class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mt-4">
			Télécharger la nouvelle photo
		</button>
	</div>

	{#if successMessage}
		<p class="text-green-500 mt-4">{successMessage}</p>
	{/if}
	{#if errorMessage}
		<p class="text-red-500 mt-4">{errorMessage}</p>
	{/if}
</div>
