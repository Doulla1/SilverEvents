<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';

	let event: any;
	let currentUser: any = user;

	currentUser.subscribe(value => {
		currentUser = value;
	});


	onMount(async () => {
		try {
			const res = await fetch(`/api/events/${$page.params.id}`);
			const data = await res.json();
			if (res.ok) {
				event = data.event;
				console.log('Événement récupéré:', event);
			} else {
				// Rediriger en cas d'erreur
				console.error(data.message);
			}
		} catch (error) {
			console.error('Erreur lors de la récupération de l\'événement:', error);
		}
	});

	// Fonction pour supprimer l'événement
	async function deleteEvent() {
		if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
			try {
				const res = await fetch(`/api/events/${event.id}`, {
					method: 'DELETE'
				});
				if (res.ok) {
					alert('Événement supprimé avec succès.');
					// Rediriger après suppression
					window.location.href = '/events';
				} else {
					console.error('Erreur lors de la suppression:', await res.json());
				}
			} catch (error) {
				console.error('Erreur lors de la suppression:', error);
			}
		}
	}

	// Fonction pour éditer l'événement
	function editEvent() {
		window.location.href = `/events/${event.id}/edit`; // Rediriger vers la page d'édition
	}

	// Fonction pour s'inscrire à l'événement
	async function register() {
		try {
			const res = await fetch(`/api/events/${event.id}/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user_id: currentUser.id })
			});
			if (res.ok) {
				alert('Inscription réussie.');
				// Recharger la page pour mettre à jour les inscriptions
				location.reload();
			} else {
				console.error('Erreur lors de l\'inscription:', await res.json());
			}
		} catch (error) {
			console.error('Erreur lors de l\'inscription:', error);
		}
	}

	// Fonction pour se désinscrire de l'événement
	async function unregister() {
		try {
			const res = await fetch(`/api/events/${event.id}/unregister`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user_id: currentUser.id })
			});
			if (res.ok) {
				alert('Désinscription réussie.');
				// Recharger la page pour mettre à jour les inscriptions
				location.reload();
			} else {
				console.error('Erreur lors de la désinscription:', await res.json());
			}
		} catch (error) {
			console.error('Erreur lors de la désinscription:', error);
		}
	}
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

		<!-- Boutons d'inscription ou de désinscription si inscris -->
		{#if currentUser && event.registrations.some(registration => registration.user.id === currentUser.id)}
			<button class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600" on:click={unregister}>
				Se désinscrire
			</button>
		{:else}
			<button class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600" on:click={register}>
				S'inscrire
			</button>
		{/if}

		<!-- Boutons d'édition et de suppression -->
		{#if currentUser && (currentUser.id === event.creator.id || currentUser.role === 'Admin')}
			<div class="flex space-x-4">
				<button on:click={editEvent} class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
					Éditer
				</button>
				<button on:click={deleteEvent} class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
					Supprimer
				</button>
			</div>
		{/if}
	{:else}
		<p class="text-center text-gray-500">Chargement...</p>
	{/if}
</main>
