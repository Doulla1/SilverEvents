<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

</script>

<div class="flex flex-col min-h-screen">
	<!-- Inclusion du Header -->
	<Header />

	<!-- Contenu principal -->
	<main class="flex-grow mx-auto w-full">
		<slot />
	</main>

	<!-- Inclusion du Footer -->
	<Footer />
</div>
