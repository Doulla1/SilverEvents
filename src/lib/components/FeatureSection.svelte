<script lang="ts">
	import FeatureCard from './FeatureCard.svelte';

	export let features = [
		{
			icon: '/icons/icons8-administrateur-homme-100.png',
			title: 'Gestion des Membres',
			description: 'Les administrateurs peuvent gérer les membres de l\'entreprise et organiser les événements.'
		},
		{
			icon: '/icons/icons8-fête-100.png',
			title: 'Création d\'Événements',
			description: 'Chaque membre peut créer des événements, inviter des collègues et gérer les inscriptions.'
		},
		{
			icon: '/icons/icons8-courrier-100.png',
			title: 'Notifications par Email',
			description: 'Tous les membres reçoivent des notifications par email pour les inviter à s\'inscrire aux événements.'
		},
		{
			icon: '/icons/icons8-bulle-100.png',
			title: 'Commentaires',
			description: 'Les membres peuvent commenter et partager ce qu\'ils apporteront aux événements, comme des boissons ou des collations.'
		},
		{
			icon: '/icons/icons8-galerie-100.png',
			title: 'Galerie de Souvenirs',
			description: 'Partagez et consultez les photos des événements passés dans une galerie dédiée.'
		}
	];
</script>

<section class="py-16 bg-gray-100">
	<div class="container mx-auto px-6 text-center">
		<h2 class="text-3xl md:text-4xl font-semibold text-gray-800 mb-12">Découvrez les Fonctionnalités</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each features as feature}
				<FeatureCard icon="{feature.icon}" title="{feature.title}"  description="{feature.description}" />
			{/each}
		</div>
	</div>
</section>
