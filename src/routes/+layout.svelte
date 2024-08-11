<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	export let data;
</script>

<div class="flex flex-col min-h-screen">
	<!-- Inclusion du Header -->
	<Header user={data.session?.user} />

	<!-- Contenu principal -->
	<main class="flex-grow container mx-auto px-6 py-8">
		<slot />
	</main>

	<!-- Inclusion du Footer -->
	<Footer />
</div>
