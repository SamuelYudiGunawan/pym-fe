import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['localhost', '.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io']
	}
});

