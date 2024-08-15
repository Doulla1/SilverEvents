<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let events = [];

	onMount(async () => {
		try {
			const res = await fetch('/api/events');
			const data = await res.json();
			if (res.ok) {
				events = data.events;
			} else {
				console.error(data.message);
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des événements:', error);
		}
	});

	function goToEvent(id: number) {
		goto(`/events/${id}`);
	}
</script>

<main class="min-h-screen bg-gray-100 py-10">
	<div class="container mx-auto px-6">
		<h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Les événements</h1>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			{#each events as event}
				<button type="button" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer text-left" on:click={() => goToEvent(event.id)} aria-label={`Voir les détails de l'événement ${event.title}`}>
					<!-- Image de Couverture -->
					{#if event.cover_image}
						<img src={event.cover_image} alt={event.title} class="w-full h-48 object-cover" />
					{/if}

					<!-- Contenu de la Carte -->
					<div class="p-4">
						<h2 class="text-xl font-semibold mb-2 text-gray-800">{event.title}</h2>
						<p class="text-sm text-gray-600 mb-4">{event.description.slice(0, 100)}{event.description.length > 100 ? '...' : ''}</p>
						<p class="text-sm text-gray-500">Créé par {event.creator.first_name} {event.creator.last_name}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</main>
