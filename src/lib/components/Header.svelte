<script>
	export let user = null;

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="bg-indigo-600 text-white shadow">
	<div class="container mx-auto px-6 py-4 flex justify-between items-center">
		<!-- Logo -->
		<a href="/" class="text-2xl font-bold">SilverEvents</a>

		<!-- Desktop Navigation -->
		<nav class="hidden md:flex space-x-6">
			{#if user?.role === 'Admin'}
				<a href="/dashboard" class="hover:text-indigo-200">Dashboard</a>
			{/if}
			<a href="/events" class="hover:text-indigo-200">Événements</a>
			<a href="/profile" class="hover:text-indigo-200">Profil</a>
			{#if user}
				<a href="/logout" class="hover:text-indigo-200">Déconnexion</a>
			{/if}
		</nav>

		<!-- Mobile Menu Button -->
		<button
			class="md:hidden flex items-center"
			on:click={toggleMenu}
			aria-label="Toggle menu">
			<svg
				class="w-6 h-6 fill-current"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24">
				<path d="M4 5h16M4 12h16M4 19h16"/>
			</svg>
		</button>
	</div>

	<!-- Mobile Navigation -->
	{#if isMenuOpen}
		<nav class="md:hidden bg-indigo-700">
			{#if user?.role === 'admin'}
				<a href="/dashboard" class="block px-4 py-2 text-sm hover:bg-indigo-500">Dashboard</a>
			{/if}
			<a href="/events" class="block px-4 py-2 text-sm hover:bg-indigo-500">Événements</a>
			<a href="/profile" class="block px-4 py-2 text-sm hover:bg-indigo-500">Profil</a>
			{#if user}
				<a href="/logout" class="block px-4 py-2 text-sm hover:bg-indigo-500">Déconnexion</a>
			{/if}
		</nav>
	{/if}
</header>
