<div class="about-container">
  <div class="about-card">
    <h1>About Pour Your Mind</h1>
    
    <div class="content">
      <p>
        <strong>Pour Your Mind</strong> is a platform where you can freely express your thoughts, 
        feelings, and ideas with the world.
      </p>

      <h2>How It Works</h2>
      <ul>
        <li><strong>Share:</strong> Post your thoughts anonymously or with your name</li>
        <li><strong>Connect:</strong> Read what others are thinking</li>
        <li><strong>Engage:</strong> Reply and have meaningful conversations</li>
      </ul>

      <h2>Why Pour Your Mind?</h2>
      <p>
        Sometimes we all need a safe space to express ourselves. Whether you want to share 
        something profound, ask a question, or just let out what's on your mind - this is 
        your space.
      </p>

      <div class="cta">
        <a href="/submit" class="btn-primary">Start Sharing</a>
        <a href="/" class="btn-secondary">Browse Thoughts</a>
      </div>
    </div>
  </div>
</div>

<style>
  .about-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .about-card {
    background-color: var(--color-cream);
    border-radius: 12px;
    padding: 3rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: var(--color-text-dark);
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  h2 {
    color: var(--color-text-dark);
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
  }

  .content p {
    color: var(--color-text-dark);
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0 2rem;
  }

  li {
    color: var(--color-text-dark);
    padding: 0.8rem;
    margin-bottom: 0.5rem;
    background-color: rgba(168, 192, 212, 0.1);
    border-left: 4px solid var(--color-dark-blue);
    border-radius: 4px;
    font-size: 1.05rem;
  }

  li strong {
    color: var(--color-dark-blue);
  }

  .cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 3rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    display: inline-block;
  }

  .btn-primary {
    background-color: var(--color-dark-blue);
    color: white;
  }

  .btn-primary:hover {
    background-color: #8ba8c0;
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--color-dark-blue);
    border: 2px solid var(--color-dark-blue);
  }

  .btn-secondary:hover {
    background-color: rgba(168, 192, 212, 0.1);
  }

  @media (max-width: 768px) {
    .about-container {
      padding: 1rem;
    }

    .about-card {
      padding: 2rem 1.5rem;
    }

    h1 {
      font-size: 2rem;
    }

    .cta {
      flex-direction: column;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
      text-align: center;
    }
  }
</style>
