<script lang="ts">
	import ProfileForm from '$lib/components/ProfileForm.svelte';
	import ChangePasswordForm from '$lib/components/ChangePasswordForm.svelte';
	import ProfilePhoto from '$lib/components/ProfilePhoto.svelte';
</script>

<main class="container mx-auto p-6">
	<!-- Section photo de profil -->
	<ProfilePhoto />

	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
		<!-- Formulaire de profil -->
		<ProfileForm />

		<!-- Formulaire pour changer le mot de passe -->
		<ChangePasswordForm />
	</div>
</main>
