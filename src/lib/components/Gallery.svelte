<script lang="ts">
	export let images: string[];
</script>

<section class="py-16 bg-white">
	<div class="container mx-auto px-6 text-center">
		<h2 class="text-3xl md:text-4xl font-semibold text-gray-800 mb-12">Galerie de Souvenirs</h2>
		<div class="columns-2 md:columns-3 gap-2">
			{#each images as image}
				<img src={image} alt="Event Image" class="w-full mb-4 rounded-lg shadow-lg" />
			{/each}
		</div>
	</div>
</section>
