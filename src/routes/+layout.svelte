<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.js';
	import './styles.css';

	onMount(() => {
		auth.checkAuth();
	});

	async function handleLogout() {
		const result = await auth.logout();
		if (result.success) {
			window.location.href = '/';
		}
	}
</script>

<div class="app">
	<header>
		<nav>
			<div class="nav-brand">
				<a href="/">Pour Your Mind</a>
			</div>
			<div class="nav-links">
				<a href="/">Home</a>
				<a href="/submit">Submit</a>
				<a href="/about">About</a>

				{#if $auth.authenticated}
					<span class="username">👤 {$auth.user.username}</span>
					<button class="logout-btn" on:click={handleLogout}>Logout</button>
				{:else if !$auth.loading}
					<a href="/login">Login</a>
				{/if}
			</div>
		</nav>
	</header>

	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		background: #a8c0d4;
	}

	header {
		background-color: #bbdce5;
		backdrop-filter: blur(10px);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	nav {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-brand a {
		font-size: 1.5rem;
		font-weight: bold;
		color: black;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-links a {
		color: black;
		text-decoration: none;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.nav-links a:hover {
		opacity: 0.8;
	}

	.username {
		color: black;
		font-weight: 600;
		padding: 0.5rem 1rem;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 20px;
	}

	.logout-btn {
		color: black;
		background-color: rgba(255, 255, 255, 0.1);
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-weight: 500;
		transition: background-color 0.2s;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.logout-btn:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
