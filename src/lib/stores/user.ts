import { writable } from 'svelte/store';
import Cookies from 'js-cookie';

// Récupère l'utilisateur depuis les cookies s'il existe, sinon utilise `null`
const storedUser = Cookies.get('user');
export const user = writable(storedUser ? JSON.parse(storedUser) : null);

// Abonnez-vous aux changements du store pour les enregistrer dans les cookies
user.subscribe(value => {
	if (value) {
		Cookies.set('user', JSON.stringify(value), { expires: 1 }); // Expire après 1 jour
	} else {
		Cookies.remove('user');
	}
});
