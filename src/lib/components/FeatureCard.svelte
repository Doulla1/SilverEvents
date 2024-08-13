<script lang="ts">
	export let icon: string;
	export let title: string;
	export let description: string;
</script>

<div class="flex items-start p-6 bg-white shadow-lg rounded-lg">
	<img src={icon} alt={title} class="w-12 h-12 mr-4" />
	<div>
		<h3 class="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
		<p class="text-gray-600">{description}</p>
	</div>
</div>
