import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Using adapter-node for Docker/Kubernetes deployment
		// This builds the app as a Node.js server
		adapter: adapter({
			// Output directory for the build
			out: 'build',
			// Precompress static assets
			precompress: true,
			// Environment variable for the port
			envPrefix: ''
		})
	}
};

export default config;
