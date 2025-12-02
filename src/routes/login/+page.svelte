<script>
  import { auth } from '$lib/stores/auth.js';
  import { goto } from '$app/navigation';

  let isLoginMode = true;
  let username = '';
  let password = '';
  let confirmPassword = '';
  let email = '';
  let loading = false;

  // Field-specific errors
  let errors = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    general: ''
  };

  function clearErrors() {
    errors = {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      general: ''
    };
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    // Username validation
    if (!username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Registration-specific validation
    if (!isLoginMode) {
      // Confirm password
      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      // Email validation (optional but must be valid if provided)
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    return isValid;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    loading = true;
    clearErrors();

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
      // Try to determine which field the error is for
      const errorMsg = result.error.toLowerCase();
      if (errorMsg.includes('username')) {
        errors.username = result.error;
      } else if (errorMsg.includes('password')) {
        errors.password = result.error;
      } else if (errorMsg.includes('email')) {
        errors.email = result.error;
      } else {
        errors.general = result.error;
      }
    }
  }

  function toggleMode() {
    isLoginMode = !isLoginMode;
    clearErrors();
    confirmPassword = '';
  }

  // Clear field error when user starts typing
  function handleInput(field) {
    errors[field] = '';
    errors.general = '';
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1>{isLoginMode ? 'Login' : 'Register'}</h1>
    <p class="subtitle">
      {isLoginMode ? 'Welcome back!' : 'Create your account'}
    </p>

    {#if errors.general}
      <div class="error-banner">
        {errors.general}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          on:input={() => handleInput('username')}
          placeholder="Enter your username"
          class:input-error={errors.username}
          disabled={loading}
        />
        {#if errors.username}
          <span class="field-error">{errors.username}</span>
        {/if}
      </div>

      {#if !isLoginMode}
        <div class="form-group">
          <label for="email">Email (optional)</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            on:input={() => handleInput('email')}
            placeholder="Enter your email"
            class:input-error={errors.email}
            disabled={loading}
          />
          {#if errors.email}
            <span class="field-error">{errors.email}</span>
          {/if}
        </div>
      {/if}

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          on:input={() => handleInput('password')}
          placeholder="Enter your password"
          class:input-error={errors.password}
          disabled={loading}
        />
        {#if errors.password}
          <span class="field-error">{errors.password}</span>
        {/if}
      </div>

      {#if !isLoginMode}
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            bind:value={confirmPassword}
            on:input={() => handleInput('confirmPassword')}
            placeholder="Confirm your password"
            class:input-error={errors.confirmPassword}
            disabled={loading}
          />
          {#if errors.confirmPassword}
            <span class="field-error">{errors.confirmPassword}</span>
          {/if}
        </div>
      {/if}

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

  .error-banner {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 4px solid #dc2626;
    font-size: 0.95rem;
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

  .input-error {
    border-color: #dc2626 !important;
    background-color: #fef2f2;
  }

  .field-error {
    display: block;
    color: #dc2626;
    font-size: 0.85rem;
    margin-top: 0.4rem;
    font-weight: 500;
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
