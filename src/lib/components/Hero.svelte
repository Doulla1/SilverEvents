<script lang="ts">
	export let title: string;
	export let description: string;
	export let ctaText: string;
	export let backgroundImage: string;
	export let ctaLink: string;
</script>

<section class="relative w-full h-screen flex items-center justify-center bg-cover bg-center" style="background-image: url({backgroundImage});">
	<div class="bg-black bg-opacity-50 p-10 text-center rounded-lg max-w-3xl">
		<h1 class="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
		<p class="text-lg md:text-xl text-gray-200 mb-8">{description}</p>
		<a href={ctaLink} class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition">
			{ctaText}
		</a>
	</div>
</section>
