<script>
	import { onMount } from 'svelte';
	import { apiFetch } from '$lib/config.js';

	let notes = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const response = await apiFetch('/notes/');
			if (!response.ok) {
				throw new Error('Failed to fetch notes');
			}
			const data = await response.json();
			notes = data.notes || [];
			loading = false;
		} catch (err) {
			error = err.message;
			loading = false;
		}
	});

	function truncateText(text, maxLength = 150) {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + '...';
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;

		return date.toLocaleDateString();
	}
</script>

<div class="home-container">
	<div class="header-section">
		<h1 class="subtitle">Share your thoughts with the world</h1>
		<a href="/submit" class="btn-create">
			<span class="btn-icon">✍️</span>
			Share Your Thoughts
		</a>
	</div>

	{#if loading}
		<div class="loading">
			<p>Loading thoughts...</p>
		</div>
	{:else if error}
		<div class="error">
			<p>Error: {error}</p>
			<p class="error-hint">Make sure your Django backend is running</p>
		</div>
	{:else if notes.length === 0}
		<div class="empty">
			<p>No thoughts yet. Be the first to share!</p>
			<a href="/submit" class="btn-primary">Share Your Thoughts</a>
		</div>
	{:else}
		<div class="notes-grid">
			{#each notes as note}
				<a href="/note/{note.id}" class="note-card">
					<div class="note-content">
						<p>{truncateText(note.content)}</p>
					</div>
					<div class="note-footer">
						<span class="author">
							{note.author || 'Anonymous'}
						</span>
						<span class="reply-count">
							💬 {note.reply_count || 0}
						</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.header-section {
		text-align: center;
		margin-bottom: 3rem;
	}

	.subtitle {
		text-align: center;
		color: white;
		font-size: 1.5rem;
		opacity: 0.9;
	}

	.btn-create {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background-color: white;
		color: var(--color-dark-blue);
		padding: 1rem 2.5rem;
		border-radius: 50px;
		font-size: 1.1rem;
		font-weight: 700;
		text-decoration: none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transition: all 0.3s ease;
		margin-top: 1rem;
	}

	.btn-create:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
		background-color: var(--color-cream);
	}

	.btn-icon {
		font-size: 1.3rem;
	}

	.notes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.note-card {
		background-color: var(--color-cream);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		min-height: 180px;
		text-decoration: none;
		color: inherit;
	}

	.note-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
	}

	.note-content {
		flex: 1;
		margin-bottom: 1rem;
	}

	.note-content p {
		color: var(--color-text-dark);
		line-height: 1.6;
	}

	.note-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		font-size: 0.9rem;
	}

	.author {
		color: var(--color-text-light);
		font-style: italic;
	}

	.reply-count {
		color: var(--color-dark-blue);
		font-weight: 500;
	}

	.loading,
	.error,
	.empty {
		text-align: center;
		padding: 4rem 2rem;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 12px;
		margin-top: 2rem;
	}

	.loading p,
	.empty p {
		font-size: 1.2rem;
		color: var(--color-text-light);
	}

	.error p {
		color: #e74c3c;
		margin-bottom: 0.5rem;
	}

	.error-hint {
		font-size: 0.9rem;
		color: var(--color-text-light);
	}

	.btn-primary {
		display: inline-block;
		margin-top: 1.5rem;
		padding: 0.8rem 2rem;
		background-color: var(--color-dark-blue);
		color: white;
		border-radius: 8px;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.btn-primary:hover {
		background-color: #8ba8c0;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
			margin-bottom: 1rem;
		}

		.btn-create {
			padding: 0.9rem 2rem;
			font-size: 1rem;
		}

		.notes-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
