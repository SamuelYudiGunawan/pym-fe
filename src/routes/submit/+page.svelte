<script>
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth.js';
  import { apiFetch } from '$lib/config.js';
  
  let content = '';
  let submitting = false;
  let postAsAnonymous = false; // Option for logged-in users

  // Reactive: determine author name and anonymous status based on auth
  $: authorName = $auth.authenticated && !postAsAnonymous ? $auth.user.username : '';
  $: isAnonymous = !$auth.authenticated || postAsAnonymous;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!content.trim()) {
      alert('Please write something before posting');
      return;
    }

    submitting = true;

    try {
      const response = await apiFetch('/notes/submit/', {
        method: 'POST',
        body: JSON.stringify({
          content: content,
          author_name: authorName,
          is_anonymous: isAnonymous
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const newNote = await response.json();
      
      // Redirect to home page after successful submission
      goto('/');
    } catch (error) {
      alert('Error posting your thought: ' + error.message);
      submitting = false;
    }
  }

  function handleCancel() {
    if (content.trim() && !confirm('Are you sure you want to discard your thought?')) {
      return;
    }
    goto('/');
  }
</script>

<div class="submit-container">
  <div class="submit-card">
    <h1>Pour Your Mind</h1>
    <p class="subtitle">Share what's on your mind</p>

    <form on:submit={handleSubmit}>
      <div class="form-group">
        <label for="content">Write As:</label>
        <textarea
          id="content"
          bind:value={content}
          placeholder="What's on your mind? Share your thoughts, feelings, or ideas..."
          rows="12"
          required
          disabled={submitting}
        ></textarea>
        <div class="char-count">
          {content.length} characters
        </div>
      </div>

      <div class="form-group">
        <div class="posting-as">
          {#if $auth.authenticated}
            <span class="posting-info">
              ✏️ Posting as: <strong>{postAsAnonymous ? 'Anonymous' : $auth.user.username}</strong>
            </span>
            <label class="checkbox-option">
              <input
                type="checkbox"
                bind:checked={postAsAnonymous}
                disabled={submitting}
              />
              Post as Anonymous instead
            </label>
          {:else}
            <span class="posting-info">
              🕶️ Posting as: <strong>Anonymous</strong>
            </span>
            <p class="login-hint">
              <a href="/login">Login</a> to post with your name
            </p>
          {/if}
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn-cancel"
          on:click={handleCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn-post"
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .submit-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .submit-card {
    background-color: var(--color-cream);
    border-radius: 12px;
    padding: 3rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: var(--color-text-dark);
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    text-align: center;
    color: var(--color-text-light);
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    color: var(--color-text-dark);
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid var(--color-dark-blue);
    border-radius: 8px;
    font-size: 1rem;
    line-height: 1.6;
    resize: vertical;
    background-color: white;
    color: var(--color-text-dark);
    transition: border-color 0.2s;
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-light-blue);
  }

  textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .char-count {
    text-align: right;
    color: var(--color-text-light);
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .posting-as {
    background-color: rgba(168, 192, 212, 0.15);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    border-left: 4px solid var(--color-dark-blue);
  }

  .posting-info {
    color: var(--color-text-dark);
    font-size: 1rem;
    display: block;
    margin-bottom: 0.8rem;
  }

  .posting-info strong {
    color: var(--color-dark-blue);
    font-size: 1.1rem;
  }

  .checkbox-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-dark);
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: normal;
  }

  .checkbox-option input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .login-hint {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-text-light);
  }

  .login-hint a {
    color: var(--color-dark-blue);
    text-decoration: underline;
  }

  .login-hint a:hover {
    color: var(--color-light-blue);
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .btn-cancel,
  .btn-post {
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-cancel {
    background-color: transparent;
    color: var(--color-text-light);
    border: 2px solid var(--color-text-light);
  }

  .btn-cancel:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .btn-post {
    background-color: var(--color-dark-blue);
    color: white;
    border: 2px solid var(--color-dark-blue);
  }

  .btn-post:hover:not(:disabled) {
    background-color: #8ba8c0;
    border-color: #8ba8c0;
  }

  .btn-cancel:disabled,
  .btn-post:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .submit-container {
      padding: 1rem;
    }

    .submit-card {
      padding: 2rem 1.5rem;
    }

    h1 {
      font-size: 2rem;
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    .btn-cancel,
    .btn-post {
      width: 100%;
    }
  }
</style>

