<script lang="ts">
  import { enhance } from '$app/forms';

  // Svelte 5 Props destructuring (Props 인터페이스 명시화)
  interface Props {
    data: {
      isLocal: boolean;
      error: string | null;
    };
    form: { unauthorized?: boolean } | null;
  }

  let { data, form }: Props = $props();

  let isLoading = $state(false);
</script>

<svelte:head>
  <title>Admin Area — Portfolio</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <h2>Admin Area</h2>

    {#if data.isLocal}
      <p class="subtitle">
        로컬 개발 환경입니다. 아래 버튼을 클릭하면 비밀번호 없이 즉시 관리자 대시보드로 진입합니다.
      </p>

      <form
        method="POST"
        action="?/login"
        use:enhance={() => {
          isLoading = true;
          return ({ update }) => {
            isLoading = false;
            void update();
          };
        }}
      >
        {#if form?.unauthorized}
          <p class="error-message">인가 요청이 거부되었습니다.</p>
        {/if}

        <button type="submit" disabled={isLoading}>
          {isLoading ? '진입 중...' : '로컬 개발자 우회 로그인'}
        </button>
      </form>
    {:else}
      <p class="subtitle" style="color: var(--color-error, #e00);">접근 거부됨</p>

      <div class="error-container">
        <p class="error-description">
          {data.error || '이메일 인증 정보가 유효하지 않습니다.'}
        </p>
        <p class="error-action-hint">
          Cloudflare Zero Trust Access 정책(Include)에 등록된 올바른 관리자 이메일 계정으로 로그인해
          주세요.
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  .login-container {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: 70vh;
    padding: 1rem;
  }

  .login-card {
    background: var(--color-basic-bg);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    max-width: 400px;
    padding: 2.5rem;
    width: 100%;
    border: 0.5px solid rgba(0, 0, 0, 0.05);
  }

  :global(html.dark) .login-card {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 0.5px solid rgba(255, 255, 255, 0.05);
  }

  h2 {
    font-size: 1.75rem;
    margin: 0 0 0.5rem 0;
    text-align: center;
  }

  .subtitle {
    color: var(--color-text-muted, #666);
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 2rem 0;
    text-align: center;
  }

  :global(html.dark) .subtitle {
    color: #999;
  }

  .error-container {
    background: rgba(238, 0, 0, 0.05);
    border: 1px solid rgba(238, 0, 0, 0.15);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: left;
  }

  :global(html.dark) .error-container {
    background: rgba(238, 0, 0, 0.1);
    border: 1px solid rgba(238, 0, 0, 0.2);
  }

  .error-description {
    color: var(--color-text);
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  .error-action-hint {
    color: var(--color-text-muted, #666);
    font-size: 0.825rem;
    line-height: 1.4;
    margin: 0;
  }

  :global(html.dark) .error-action-hint {
    color: #aaa;
  }

  .error-message {
    color: #e00;
    font-size: 0.85rem;
    margin: -0.5rem 0 1.5rem 0;
    text-align: left;
  }

  button {
    background: var(--color-primary, #000);
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.85rem;
    transition: opacity 0.2s ease;
    width: 100%;
  }

  button:hover:not(:disabled) {
    opacity: 0.9;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
