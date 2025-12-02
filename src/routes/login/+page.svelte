<script>
  import { auth } from '$lib/stores/auth.js';
  import { goto } from '$app/navigation';

  let isLoginMode = true;
  let username = '';
  let password = '';
  let email = '';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    error = '';
    
    if (!username || !password) {
      error = 'Username and password are required';
      return;
    }

    loading = true;

    let result;
    if (isLoginMode) {
      result = await auth.login(username, password);
    } else {
      result = await auth.register(username, password, email);
    }

    loading = false;

    if (result.success) {
      goto('/');
    } else {
      error = result.error;
    }
  }

  function toggleMode() {
    isLoginMode = !isLoginMode;
    error = '';
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1>{isLoginMode ? 'Login' : 'Register'}</h1>
    <p class="subtitle">
      {isLoginMode ? 'Welcome back!' : 'Create your account'}
    </p>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          placeholder="Enter your username"
          required
          disabled={loading}
        />
      </div>

      {#if !isLoginMode}
        <div class="form-group">
          <label for="email">Email (optional)</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
      {/if}

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          required
          disabled={loading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={loading}>
        {loading ? 'Please wait...' : (isLoginMode ? 'Login' : 'Register')}
      </button>
    </form>

    <div class="toggle-mode">
      {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
      <button type="button" class="link-button" on:click={toggleMode}>
        {isLoginMode ? 'Register' : 'Login'}
      </button>
    </div>

    <div class="back-home">
      <a href="/">← Back to Home</a>
    </div>
  </div>
</div>

<style>
  .auth-container {
    max-width: 450px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .auth-card {
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

  .error-message {
    background-color: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 4px solid #c33;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    color: var(--color-text-dark);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid var(--color-dark-blue);
    border-radius: 8px;
    font-size: 1rem;
    background-color: white;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--color-light-blue);
  }

  input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-submit {
    width: 100%;
    background-color: var(--color-dark-blue);
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.2s;
    margin-top: 1rem;
  }

  .btn-submit:hover:not(:disabled) {
    background-color: #8ba8c0;
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .toggle-mode {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    color: var(--color-text-light);
  }

  .link-button {
    background: none;
    border: none;
    color: var(--color-dark-blue);
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 0.5rem;
  }

  .link-button:hover {
    color: var(--color-light-blue);
  }

  .back-home {
    text-align: center;
    margin-top: 1.5rem;
  }

  .back-home a {
    color: var(--color-text-light);
    text-decoration: none;
    font-size: 0.9rem;
  }

  .back-home a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .auth-container {
      padding: 1rem;
    }

    .auth-card {
      padding: 2rem 1.5rem;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>

