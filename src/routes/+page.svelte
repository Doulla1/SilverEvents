<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import FeatureSection from '$lib/components/FeatureSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';

	const backgroundImage = '/images/dark_celebrating-their-birthday.jpg';
	const title = 'Bienvenue sur SilverEvents';
	const description = 'Gérez vos événements d\'entreprise en toute simplicité. Créez, participez et partagez vos moments avec vos collègues.';
	const ctaText = 'Se connecter';
	const ctaLink = '/login';

	const images = [
		'/images/cheerful-people-with-yoga-mats-chatting-laughing.jpg',
		'/images/elderly-people-celebrating-their-birthday.jpg',
		'/images/full-shot-friends-climbing-wall.jpg',
		'/images/kayaking-man-paddling-kayak-canoeing-paddling.jpg',
		'/images/outdoor-team-orienteering-activity.jpg',
		'/images/travel-hiking-adventure-concept-back-view-young-friends-hugging-together-looking-lake-beautiful-autumn-forest.jpg',
	];
</script>

<main>
	<Hero {title} {description} {ctaText} {ctaLink} {backgroundImage} />
	<FeatureSection />
	<Gallery {images} />
</main>
