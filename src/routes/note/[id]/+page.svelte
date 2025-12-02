<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.js';
	import { apiFetch } from '$lib/config.js';

	let note = null;
	let replies = [];
	let loading = true;
	let error = null;
	let submittingReply = false;

	// Reply form data
	let replyContent = '';
	let replyAsAnonymous = false; // Option for logged-in users

	$: noteId = $page.params.id;

	// Reactive: determine author name and anonymous status based on auth
	$: replyAuthor = $auth.authenticated && !replyAsAnonymous ? $auth.user.username : '';
	$: replyAnonymous = !$auth.authenticated || replyAsAnonymous;

	onMount(async () => {
		await fetchNote();
	});

	async function fetchNote() {
		try {
			const response = await apiFetch(`/notes/${noteId}/`);
			if (!response.ok) {
				throw new Error('Note not found');
			}
			const data = await response.json();
			note = data.note || data;
			replies = note.replies || [];
			loading = false;
		} catch (err) {
			error = err.message;
			loading = false;
		}
	}

	async function handleSubmitReply(event) {
		event.preventDefault();

		if (!replyContent.trim()) {
			alert('Please write a reply');
			return;
		}

		submittingReply = true;

		try {
			const response = await apiFetch(`/notes/${noteId}/replies/`, {
				method: 'POST',
				body: JSON.stringify({
					content: replyContent,
					author_name: replyAuthor,
					is_anonymous: replyAnonymous
				})
			});

			if (!response.ok) {
				throw new Error('Failed to post reply');
			}

			// Refresh the note to get updated replies
			await fetchNote();

			// Reset form
			replyContent = '';

			submittingReply = false;
		} catch (err) {
			alert('Error posting reply: ' + err.message);
			submittingReply = false;
		}
	}

	function formatDate(dateString) {
		// Backend already sends formatted dates, just return them
		// If it's a timestamp, format it; otherwise return as-is
		if (!dateString) return 'Unknown date';

		try {
			// Try to parse if it's an ISO date
			const date = new Date(dateString);
			if (!isNaN(date.getTime())) {
				return date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				});
			}
		} catch (e) {
			// If parsing fails, return the string as-is
		}

		// Return formatted string from backend
		return dateString;
	}
</script>

<div class="detail-container">
	{#if loading}
		<div class="loading">
			<p>Loading...</p>
		</div>
	{:else if error}
		<div class="error">
			<p>Error: {error}</p>
			<a href="/" class="back-link">← Back to Home</a>
		</div>
	{:else if note}
		<a href="/" class="back-link">← Back</a>

		<div class="note-detail">
			<h2>{note.author || 'Anonymous'}'s Note</h2>
			<div class="note-meta">
				<span class="author">
					by {note.author || 'Anonymous'}
				</span>
				<span class="date">{formatDate(note.created_at)}</span>
			</div>
			<div class="note-content">
				<p>{note.content}</p>
			</div>
		</div>

		<div class="replies-section">
			<h3>Replies ({replies.length})</h3>

			{#if replies.length === 0}
				<p class="no-replies">No replies yet. Be the first to respond!</p>
			{:else}
				<div class="replies-list">
					{#each replies as reply}
						<div class="reply-item">
							<div class="reply-header">
								<strong>{reply.author || 'Anonymous'}</strong>
								<span class="reply-date">{formatDate(reply.created_at)}</span>
							</div>
							<p class="reply-content">{reply.content}</p>
						</div>
					{/each}
				</div>
			{/if}

			<form class="reply-form" on:submit={handleSubmitReply}>
				<h4>Add a Reply</h4>

				<textarea
					bind:value={replyContent}
					placeholder="Write your reply..."
					rows="4"
					required
					disabled={submittingReply}
				></textarea>

				<div class="form-options">
					<div class="posting-as">
						{#if $auth.authenticated}
							<span class="posting-info">
								✏️ Replying as: <strong
									>{replyAsAnonymous ? 'Anonymous' : $auth.user.username}</strong
								>
							</span>
							<label class="checkbox-option">
								<input type="checkbox" bind:checked={replyAsAnonymous} disabled={submittingReply} />
								Reply as Anonymous instead
							</label>
						{:else}
							<span class="posting-info">
								🕶️ Replying as: <strong>Anonymous</strong>
							</span>
							<p class="login-hint">
								<a href="/login">Login</a> to reply with your name
							</p>
						{/if}
					</div>
				</div>

				<button type="submit" class="btn-submit" disabled={submittingReply}>
					{submittingReply ? 'Posting...' : 'Post Reply'}
				</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.detail-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 0;
	}

	.back-link {
		display: inline-block;
		color: white;
		font-weight: 500;
		margin-bottom: 1.5rem;
		text-decoration: none;
		transition: opacity 0.2s;
	}

	.back-link:hover {
		opacity: 0.8;
	}

	.note-detail {
		background-color: var(--color-cream);
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.note-detail h2 {
		color: var(--color-text-dark);
		margin-bottom: 1rem;
		font-size: 1.8rem;
	}

	.note-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid rgba(0, 0, 0, 0.1);
		font-size: 0.9rem;
	}

	.author {
		color: var(--color-text-light);
		font-style: italic;
	}

	.date {
		color: var(--color-text-light);
	}

	.note-content {
		line-height: 1.8;
		font-size: 1.1rem;
	}

	.note-content p {
		color: var(--color-text-dark);
		white-space: pre-wrap;
	}

	.replies-section {
		background-color: var(--color-cream);
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.replies-section h3 {
		color: var(--color-text-dark);
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
	}

	.no-replies {
		color: var(--color-text-light);
		text-align: center;
		padding: 2rem;
		font-style: italic;
	}

	.replies-list {
		margin-bottom: 2rem;
	}

	.reply-item {
		padding: 1rem;
		border-left: 3px solid var(--color-dark-blue);
		background-color: rgba(168, 192, 212, 0.1);
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.reply-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.reply-header strong {
		color: var(--color-text-dark);
	}

	.reply-date {
		color: var(--color-text-light);
		font-size: 0.85rem;
	}

	.reply-content {
		color: var(--color-text-dark);
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.reply-form {
		border-top: 2px solid rgba(0, 0, 0, 0.1);
		padding-top: 2rem;
		margin-top: 2rem;
	}

	.reply-form h4 {
		color: var(--color-text-dark);
		margin-bottom: 1rem;
		font-size: 1.2rem;
	}

	textarea {
		width: 100%;
		padding: 1rem;
		border: 2px solid var(--color-dark-blue);
		border-radius: 8px;
		font-size: 1rem;
		resize: vertical;
		background-color: white;
		color: var(--color-text-dark);
		margin-bottom: 1rem;
	}

	textarea:focus {
		outline: none;
		border-color: var(--color-light-blue);
	}

	.form-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.posting-as {
		background-color: rgba(168, 192, 212, 0.15);
		padding: 1rem 1.5rem;
		border-radius: 8px;
		border-left: 4px solid var(--color-dark-blue);
	}

	.posting-info {
		color: var(--color-text-dark);
		font-size: 0.95rem;
		display: block;
		margin-bottom: 0.8rem;
	}

	.posting-info strong {
		color: var(--color-dark-blue);
		font-size: 1rem;
	}

	.checkbox-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text-dark);
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: normal;
	}

	.checkbox-option input[type='checkbox'] {
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	.login-hint {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		color: var(--color-text-light);
	}

	.login-hint a {
		color: var(--color-dark-blue);
		text-decoration: underline;
	}

	.login-hint a:hover {
		color: var(--color-light-blue);
	}

	.btn-submit {
		background-color: var(--color-dark-blue);
		color: white;
		padding: 0.8rem 2rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.btn-submit:hover:not(:disabled) {
		background-color: #8ba8c0;
	}

	.btn-submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.loading,
	.error {
		text-align: center;
		padding: 4rem 2rem;
		background-color: var(--color-cream);
		border-radius: 12px;
	}

	.error p {
		color: #e74c3c;
		margin-bottom: 1rem;
	}

	@media (max-width: 768px) {
		.detail-container {
			padding: 1rem;
		}

		.note-detail,
		.replies-section {
			padding: 1.5rem;
		}

		.note-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}
</style>
