<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let event: any;
	let title = '';
	let description = '';
	let start_date = '';
	let end_date = '';
	let location = '';
	let cover_image: File | null = null;  // Le nouveau fichier d'image téléversé
	let existingCoverImage = '';  // L'URL de l'image de couverture existante
	let errorMessage = '';
	let successMessage = '';
	let removeCoverImage = false; // Indique si l'utilisateur veut supprimer l'image existante

	// Charger les données de l'événement à l'initialisation
	onMount(async () => {
		try {
			const res = await fetch(`/api/events/${$page.params.id}`);
			const data = await res.json();
			if (res.ok) {
				event = data.event;
				title = event.title;
				description = event.description;
				start_date = new Date(event.start_date).toISOString().slice(0, 16);
				end_date = new Date(event.end_date).toISOString().slice(0, 16);
				location = event.location;
				existingCoverImage = event.cover_image;
			} else {
				errorMessage = data.message || 'Impossible de charger l\'événement.';
			}
		} catch (error) {
			errorMessage = 'Erreur lors de la récupération de l\'événement : ' + error.message;
		}
	});

	async function updateEvent() {
		try {
			// Valider les champs requis
			if (!title || !start_date || !end_date || !location) {
				errorMessage = 'Tous les champs sont obligatoires.';
				return;
			}

			// Utiliser FormData pour envoyer les données du formulaire et le fichier
			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('start_date', start_date);
			formData.append('end_date', end_date);
			formData.append('location', location);
			formData.append('removeCoverImage', String(removeCoverImage)); // Transmettre la demande de suppression d'image
			if (cover_image) {
				formData.append('cover_image', cover_image);
			}

			const response = await fetch(`/api/events/${$page.params.id}`, {
				method: 'PUT',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = 'Événement mis à jour avec succès !';
				setTimeout(() => goto(`/events/${event.id}`), 2000); // Rediriger vers la page de l'événement mis à jour
			} else {
				errorMessage = result.message || 'Une erreur est survenue lors de la mise à jour de l\'événement.';
			}
		} catch (error) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer : ' + error.message;
		}
	}

	function handleCoverImageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			cover_image = target.files[0];
		}
	}
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="max-w-md w-full bg-white shadow-md rounded-lg p-8">
		<h1 class="text-2xl font-bold mb-6 text-gray-800">Modifier l'Événement</h1>
		<form on:submit|preventDefault={updateEvent} class="space-y-6">
			<div>
				<label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
				<input id="title" bind:value={title} type="text" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
				<textarea id="description" bind:value={description} rows="3"
									class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
			</div>

			<div>
				<label for="start_date" class="block text-sm font-medium text-gray-700">Date de Début</label>
				<input id="start_date" bind:value={start_date} type="datetime-local" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>

			<div>
				<label for="end_date" class="block text-sm font-medium text-gray-700">Date de Fin</label>
				<input id="end_date" bind:value={end_date} type="datetime-local" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>

			<div>
				<label for="location" class="block text-sm font-medium text-gray-700">Lieu</label>
				<input id="location" bind:value={location} type="text" required
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>

			<!-- Image de couverture -->
			<div>
				<label for="cover_image" class="block text-sm font-medium text-gray-700">Image de Couverture</label>
				{#if existingCoverImage && !removeCoverImage}
					<div class="relative">
						<img src={existingCoverImage} alt="Couverture actuelle" class="w-full h-64 object-cover rounded-lg shadow-md mb-4" />
						<button type="button" on:click={() => removeCoverImage = true} class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
							Supprimer l'image
						</button>
					</div>
				{/if}

				{#if !existingCoverImage || removeCoverImage}
					<input id="cover_image" type="file" accept="image/*"
								 on:change={handleCoverImageChange}
								 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
				{/if}
			</div>

			<button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Mettre à Jour l'Événement
			</button>

			{#if errorMessage}
				<p class="mt-4 text-red-500 text-sm">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="mt-4 text-green-500 text-sm">{successMessage}</p>
			{/if}
		</form>
	</div>
</main>
