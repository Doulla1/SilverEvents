<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import FeatureSection from '$lib/components/FeatureSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';

	const backgroundImage = '/images/hero-bg.jpg';
	const title = 'Bienvenue sur SilverEvents';
	const description = 'Gérez vos événements d\'entreprise en toute simplicité. Créez, participez et partagez vos moments avec vos collègues.';
	const ctaText = 'Se connecter';
	const ctaLink = '/login';

	const images = [
		'/images/event1.jpg',
		'/images/event2.jpg',
		'/images/event3.jpg',
		'/images/event4.jpg',
		'/images/event5.jpg',
	];
</script>

<main>
	<Hero {title} {description} {ctaText} {ctaLink} {backgroundImage} />
	<FeatureSection />
	<Gallery {images} />
</main>
