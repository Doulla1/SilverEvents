<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let event: any;

	onMount(async () => {
		try {
			const res = await fetch(`/api/events/${$page.params.id}`);
			const data = await res.json();
			if (res.ok) {
				event = data.event;
				console.log(event);
			} else {
				// Rediriger en cas d'erreur
				console.error(data.message);
			}
		} catch (error) {
			console.error('Erreur lors de la récupération de l\'événement:', error);
		}
	});
</script>

<main class="container mx-auto p-6">
	{#if event}
		<!-- Image de couverture -->
		<img src={event.cover_image} alt="Couverture de l'évènement" class="w-full h-64 object-cover rounded-lg shadow-md mb-6" />

		<!-- Titre et Description -->
		<h1 class="text-4xl font-bold mb-4">{event.title}</h1>
		<span>Créé par {event.creator.first_name} {event.creator.last_name} </span>
		<p class="text-lg text-gray-600 mb-4">{event.description}</p>

		<!-- Dates et Lieu -->
		<div class="mb-4">
			<p class="text-sm text-gray-500"><strong>Date de début :</strong> {new Date(event.start_date).toLocaleDateString()}</p>
			<p class="text-sm text-gray-500"><strong>Date de fin :</strong> {new Date(event.end_date).toLocaleDateString()}</p>
			<p class="text-sm text-gray-500"><strong>Lieu :</strong> {event.location}</p>
		</div>

		<!-- Liste des inscrits -->
		<div class="mb-6">
			<h2 class="text-2xl font-semibold mb-4">Participants</h2>
			<ul class="list-disc list-inside">
				{#each event.registrations as registration}
					<li class="text-gray-700">{registration.user.first_name} {registration.user.last_name}</li>
				{/each}
			</ul>
		</div>
	{:else}
		<p class="text-center text-gray-500">Chargement...</p>
	{/if}
</main>
