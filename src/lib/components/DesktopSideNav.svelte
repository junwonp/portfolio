<script lang="ts">
  import BaseSideNav from '$lib/components/BaseSideNav.svelte';
  import { createScrollSpy, getPageScrollY, scrollPageTo } from '$lib/states/scrollSpy.svelte';

  interface NavSection {
    id: string;
    label: string;
  }

  interface Props {
    sections: NavSection[];
  }

  let { sections }: Props = $props();

  const spy = createScrollSpy(() => sections.map((s) => s.id));
  let activeId = $derived(spy.activeId);

  function scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;

    scrollPageTo(el.getBoundingClientRect().top + getPageScrollY());
    spy.activeId = id;
  }
</script>

<BaseSideNav {sections} {activeId} onselect={scrollTo} ariaLabel="Page sections" />
