<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { formatISO } from 'date-fns';

	let title = '';
	let description = '';
	let start_date = '';
	let end_date = '';
	let location = '';
	let cover_image = '';
	let errorMessage = '';
	let successMessage = '';

	// Validation initiale des dates
	onMount(() => {
		const now = new Date();
		start_date = formatISO(now).slice(0, 16); // Format: YYYY-MM-DDTHH:mm
		end_date = formatISO(new Date(now.getTime() + 60 * 60 * 1000)).slice(0, 16); // Une heure plus tard
	});

	async function createEvent() {
		try {
			// Valider les champs requis
			if (!title || !start_date || !end_date || !location) {
				errorMessage = 'Tous les champs sont obligatoires.';
				return;
			}

			const response = await fetch('/api/events', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title, start_date, end_date, location, cover_image })
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = 'Événement créé avec succès !';
				setTimeout(() => goto(`/events/${result.event.id}`), 2000); // Rediriger vers la page de l'événement créé
			} else {
				errorMessage = result.message || 'Une erreur est survenue lors de la création de l\'événement.';
			}
		} catch (error) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer : ' + error.message;
		}
	}
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="max-w-md w-full bg-white shadow-md rounded-lg p-8">
		<h1 class="text-2xl font-bold mb-6 text-gray-800">Créer un Événement</h1>
		<form on:submit|preventDefault={createEvent} class="space-y-6">
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

			<div>
				<label for="cover_image" class="block text-sm font-medium text-gray-700">Image de Couverture (URL)</label>
				<input id="cover_image" bind:value={cover_image} type="url"
							 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
			</div>

			<button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Créer l'Événement
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
