<script lang="ts">
  interface Props {
    skill: string;
  }
  let { skill }: Props = $props();
</script>

<span class="skill-chip">
  {skill}
</span>

<style>
  .skill-chip {
    background: var(--color-basic-bg);
    border: 1px solid var(--color-bg-divider);
    border-radius: 6px;
    color: var(--color-sub);
    font-size: 0.875rem;
    padding: 0.35rem 0.6rem;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    display: inline-block;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .skill-chip:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
    background: var(--color-basic-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-shadow);
  }

  @media print {
    .skill-chip {
      background: transparent !important;
      border: 1px solid var(--color-bg-divider) !important;
      color: var(--color-bold) !important;
      padding: 0.2rem 0.4rem;
    }
  }
</style>
