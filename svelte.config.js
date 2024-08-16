import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		// Si vous utilisez une autre structure de répertoires ou des assets spécifiques :
		files: {
			assets: 'static'
		},

	},
};

export default config;
