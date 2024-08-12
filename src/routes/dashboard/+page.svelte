<script>
	export let data;
	let session = data.session;

	// Vérifie que la session et l'utilisateur existent
	if (!session || !session.name) {
		// Cela peut signifier que la session n'a pas été correctement passée
		throw new Error('Session ou utilisateur non défini');
	}
</script>

<main class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
	<div class="max-w-xl w-full bg-white shadow-lg rounded-lg p-8">
		<h1 class="text-3xl font-bold text-gray-800 mb-4">Bienvenue, {session.name}!</h1>
		<p class="text-gray-600 mb-6">
			Vous êtes connecté en tant que <span class="font-semibold text-indigo-600">{session.role}</span>.
			Utilisez le menu ci-dessous pour accéder aux fonctionnalités administratives.
		</p>

		<div class="mt-8">
			<a href="/dashboard/create-user"
				 class="inline-block w-full text-center bg-indigo-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
				Créer un nouvel utilisateur
			</a>
		</div>
	</div>
</main>
