<script>
	let first_name = '';
	let last_name = '';
	let email = '';
	let position = '';
	let successMessage = '';
	let errorMessage = '';

	async function createUser() {
		try {
			const response = await fetch('/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ first_name, last_name, email, position })
			});

			const result = await response.json();

			if (response.ok) {
				successMessage = result.message;
				// Réinitialiser les champs
				first_name = '';
				last_name = '';
				email = '';
				position = '';
			} else {
				errorMessage = result.message;
			}
		} catch ( error ) {
			errorMessage = 'Une erreur est survenue. Veuillez réessayer: ' + error.message;
		}
	}
</script>

<main>
	<h1>Créer un utilisateur</h1>
	<form on:submit|preventDefault={createUser}>
		<div>
			<label for="first_name">Prénom</label>
			<input id="first_name" bind:value={first_name} type="text" required />
		</div>
		<div>
			<label for="last_name">Nom</label>
			<input id="last_name" bind:value={last_name} type="text" required />
		</div>
		<div>
			<label for="email">Email</label>
			<input id="email" bind:value={email} type="email" required />
		</div>
		<div>
			<label for="position">Poste</label>
			<input id="position" bind:value={position} type="text" required />
		</div>
		<button type="submit">Créer l'utilisateur</button>
	</form>

	{#if successMessage}
		<p>{successMessage}</p>
	{/if}
	{#if errorMessage}
		<p style="color: red;">{errorMessage}</p>
	{/if}
</main>
